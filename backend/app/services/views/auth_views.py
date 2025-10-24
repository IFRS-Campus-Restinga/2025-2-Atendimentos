from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework.authtoken.models import Token
from django.contrib.auth import get_user_model
from services.auth import verify_google_token

class GoogleLoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        token_id = request.data.get("token")
        idinfo = verify_google_token(token_id)

        if idinfo:
            email = idinfo.get("email")
            name = idinfo.get("name")
            picture = idinfo.get("picture")

            User = get_user_model()
            user, _ = User.objects.get_or_create(
                email=email,
                defaults={"username": email, "first_name": name}
            )
            token, _ = Token.objects.get_or_create(user=user)

            return Response({
                "token": token.key,
                "user": {
                    "email": email,
                    "name": name,
                    "picture": picture
                }
            })
        else:
            return Response({"error": "Token inválido"}, status=401)

##rom rest_framework.views import APIView
##rom rest_framework.response import Response
##rom rest_framework.permissions import AllowAny
##rom rest_framework.authtoken.models import Token
##rom django.contrib.auth import get_user_model
##rom google.oauth2 import id_token
##rom google.auth.transport import requests
##
##lass GoogleLoginView(APIView):
##   permission_classes = [AllowAny]
##
##   def post(self, request):
##       token_id = request.data.get("token")
##       try:
##           CLIENT_ID = "SEU_CLIENT_ID_DO_GOOGLE"
##           idinfo = id_token.verify_oauth2_token(token_id, requests.Request(), CLIENT_ID)
##
##           email = idinfo["email"]
##           User = get_user_model()
##           user, _ = User.objects.get_or_create(email=email, defaults={"username": email})
##           token, _ = Token.objects.get_or_create(user=user)
##
##           return Response({"token": token.key})
##
##       except ValueError:
##           return Response({"error": "Token inválido"}, status=401)




##from rest_framework.views import APIView
##from rest_framework.response import Response
##from rest_framework.permissions import AllowAny
##from rest_framework.authtoken.models import Token
##from django.contrib.auth import get_user_model
##
##class GoogleLoginView(APIView):
##    permission_classes = [AllowAny]
##
##    def post(self, request):
##        email = request.data.get("email")
##        User = get_user_model()
##        user, _ = User.objects.get_or_create(email=email, defaults={"username": email})
##        token, _ = Token.objects.get_or_create(user=user)
##        return Response({"token": token.key})

