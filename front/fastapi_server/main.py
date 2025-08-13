from fastapi import FastAPI
from pydantic import BaseModel
from sentence_transformers import SentenceTransformer, util

app = FastAPI()

# 지연 로딩 (요청 올 때만 로딩되도록)
model = None

def get_model():
    global model
    if model is None:
        model = SentenceTransformer("snunlp/KR-SBERT-V40K-klueNLI-augSTS")
    return model


# 입력 형식 정의
class MatchRequest(BaseModel):
    original: str
    user: str


# 분석 엔드포인트
@app.post("/analyze")
def analyze_match(data: MatchRequest):
    model = get_model()
    original_embedding = model.encode(data.original, convert_to_tensor=True)
    user_embedding = model.encode(data.user, convert_to_tensor=True)
    similarity = util.pytorch_cos_sim(original_embedding, user_embedding)
    score = round(float(similarity.item()) * 100, 2)

    return {
        "matchingRate": score,
        "original": data.original,
        "user": data.user
    }