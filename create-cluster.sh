# copy past into CMD \ may be needed on linux machines
gcloud container clusters create proxy-study-cluster ^
    --project v2-layer8-playground ^
    --zone asia-southeast1-a ^
    --num-nodes 1 ^
    --min-nodes 0 ^
    --max-nodes 3 ^
    --enable-autoscaling ^
    --spot ^
    --machine-type e2-medium ^
    --disk-size 32 ^
    --network default ^
    --scopes "https://www.googleapis.com/auth/cloud-platform"