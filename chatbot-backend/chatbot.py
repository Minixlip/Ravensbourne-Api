from flask import Flask, request, jsonify
from flask_cors import CORS
import torch
from transformers import AutoModelForCausalLM, AutoTokenizer

app = Flask(__name__)
CORS(app)  # Enable CORS for React frontend integration

# Load pretrained model and tokenizer once at startup
print("Loading model and tokenizer...")
tokenizer = AutoTokenizer.from_pretrained("microsoft/DialoGPT-small")
model = AutoModelForCausalLM.from_pretrained("microsoft/DialoGPT-small")
print("Model and tokenizer loaded successfully!")

@app.route('/chat', methods=['POST'])
def chat():
    data = request.json
    message = data.get('message', '')
    
    # Encode the user input
    input_ids = tokenizer.encode(message + tokenizer.eos_token, return_tensors='pt')
    
    # Generate a response
    output = model.generate(
        input_ids,
        max_length=100,
        pad_token_id=tokenizer.eos_token_id,
        no_repeat_ngram_size=3,
        do_sample=True,
        top_k=50,
        top_p=0.9,
        temperature=0.7
    )
    
    # Decode the response (excluding the input)
    response = tokenizer.decode(output[0][input_ids.shape[-1]:], skip_special_tokens=True)
    
    # Return the response as JSON
    return jsonify({"response": response})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)