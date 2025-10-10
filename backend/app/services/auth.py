
from google.oauth2 import id_token
from google.auth.transport import requests

def verify_google_token(token):
    try:
        idinfo = id_token.verify_oauth2_token(token, requests.Request())
        return idinfo  # contém email, name, picture, etc.
    except ValueError:
        return None