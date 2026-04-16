import os

def send_whatsapp_message(phone_number: str, message: str):
    """
    Simula o envio de uma mensagem de WhatsApp via API externa.
    Para uso em produção, integre com APIs como Twilio, Z-API, Evolution API ou a Meta Cloud API Oficial.
    """
    print(f"\n" + "="*50)
    print(f"📱 ENVIANDO WHATSAPP [Simulado]")
    print(f"==================================================")
    print(f"Para: {phone_number}")
    print(f"Mensagem:\n{message}")
    print(f"==================================================\n")
    
    # Exemplo de integração futura com Evolution API/Z-API:
    # api_url = os.getenv("WHATSAPP_API_URL")
    # instance = os.getenv("WHATSAPP_INSTANCE")
    # token = os.getenv("WHATSAPP_TOKEN")
    # 
    # headers = {"apikey": token}
    # payload = { "number": phone_number, "textMessage": { "text": message } }
    # try:
    #     requests.post(f"{api_url}/message/sendText/{instance}", json=payload, headers=headers)
    # except Exception as e:
    #     print(f"Erro: {e}")
