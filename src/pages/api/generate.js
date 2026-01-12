export default function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    const { length, includeUppercase, includeLowercase, includeNumbers, includeSymbols } = req.body;

    let charset = "";
    if (includeUppercase) charset += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    if (includeLowercase) charset += "abcdefghijklmnopqrstuvwxyz";
    if (includeNumbers) charset += "0123456789";
    if (includeSymbols) charset += "!@#$%^&*()_+~`|}{[]:;?><,./-=";

    // Fallback if nothing selected
    if (charset === "") {
        charset = "abcdefghijklmnopqrstuvwxyz";
    }

    let password = "";
    // Use crypto for better randomness if available, or math.random for simplicity in this demo
    for (let i = 0; i < length; i++) {
        password += charset.charAt(Math.floor(Math.random() * charset.length));
    }

    res.status(200).json({ password });
}
