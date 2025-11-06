from django.conf import settings
from google.oauth2 import id_token
from google.auth.transport import requests
import time

def verify_google_token(token):
    try:
        CLIENT_ID = settings.GOOGLE_CLIENT_ID
        idinfo = id_token.verify_oauth2_token(token, requests.Request(), CLIENT_ID)

        if idinfo['aud'] != CLIENT_ID:
            raise ValueError("Token não corresponde ao CLIENT_ID")

        if idinfo['exp'] < time.time():
            raise ValueError("Token expirado")

        return {
            "email": idinfo.get("email"),
            "name": idinfo.get("name"),
            "picture": idinfo.get("picture"),
            "sub": idinfo.get("sub")
        }

    except ValueError:
        return None


##from google.oauth2 import id_token
##from google.auth.transport import requests
##
##def verify_google_token(token):
##    try:
##        idinfo = id_token.verify_oauth2_token(token, requests.Request())
##        return idinfo
##    except ValueError:
##        return None