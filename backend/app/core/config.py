from dotenv import load_dotenv
import os

load_dotenv()  # loads from .env file

HUGGINGFACE_TOKEN = os.getenv("HF_TOKEN")
