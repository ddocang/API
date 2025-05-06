from flask import Flask
from flask_cors import CORS

app = Flask(__name__)
CORS(app, origins=[
    "http://localhost:3000",  # 개발용
    "https://www.hyge.store",  # 실서비스
    "https://hyge-xi.vercel.app",  # Vercel 기본 URL
    "https://hyge-4ol5b179e-ddocangs-projects.vercel.app"  # 임시 Vercel 도메인
])
