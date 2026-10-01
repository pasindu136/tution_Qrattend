export async function sendSMS(recipient: string, message: string) {
    const API_URL = "https://dashboard.smsapi.lk/api/v3/sms/send";
    const API_TOKEN = "585|qUoYlvu9KBpRefBdBJYw7BLl4dPcTaVbVzctQEPY"; // Ideally move to .env

    // Format phone number to international format if starting with 0
    let formattedPhone = recipient.replace(/\s+/g, "");
    if (formattedPhone.startsWith("0")) {
        formattedPhone = "94" + formattedPhone.substring(1);
    }

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${API_TOKEN}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                recipient: formattedPhone,
                sender_id: "SMSAPI Demo", // Default sender ID for free tier
                type: "plain",
                message: message
            })
        });

        if (!response.ok) {
            const text = await response.text();
            console.error("SMS API HTTP Error:", text);
            return { success: false, error: text };
        }

        const data = await response.json();
        
        // SMSAPI.lk often returns HTTP 200 but includes { status: 'error', message: '...' } in the body
        if (data.status === 'error' || data.error) {
            console.error("SMS API Payload Error:", data);
            return { success: false, error: data.message || JSON.stringify(data) };
        }

        return { success: true, data };
    } catch (error: any) {
        console.error("SMS Sending Failed:", error);
        return { success: false, error: error.message };
    }
}
