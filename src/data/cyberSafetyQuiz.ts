export interface CyberSafetyQuestion {
  id: string;
  category: string;
  categoryHi: string;
  scenario: string;
  scenarioHi: string;
  options: string[];
  optionsHi: string[];
  correctIndex: number;
  explanation: string;
  explanationHi: string;
  action: string;
  actionHi: string;
}

export const CYBER_SAFETY_QUIZ: CyberSafetyQuestion[] = [
  {
    id: 'upi-refund',
    category: 'UPI phishing',
    categoryHi: 'UPI फिशिंग',
    scenario: 'A caller says they are from airline support and sends a UPI collect request to “process your refund”. What should you do?',
    scenarioHi: 'एक कॉल करने वाला खुद को एयरलाइन सपोर्ट बताकर “रिफंड” के लिए UPI कलेक्ट रिक्वेस्ट भेजता है। आप क्या करेंगे?',
    options: [
      'Approve it because it is a refund',
      'Decline it and verify through the official app or website',
      'Share your UPI PIN so the refund can be credited',
    ],
    optionsHi: [
      'रिफंड समझकर इसे अप्रूव करेंगे',
      'इसे अस्वीकार करके आधिकारिक ऐप या वेबसाइट से जाँच करेंगे',
      'रिफंड पाने के लिए UPI PIN साझा करेंगे',
    ],
    correctIndex: 1,
    explanation: 'A UPI PIN authorizes money leaving your account. Receiving money never requires entering a PIN or approving an unexpected collect request.',
    explanationHi: 'UPI PIN आपके खाते से पैसे भेजने की अनुमति देता है। पैसे पाने के लिए PIN डालना या अनजान कलेक्ट रिक्वेस्ट अप्रूव करना जरूरी नहीं है।',
    action: 'Decline the request, preserve the message, and call 1930 immediately if money was lost.',
    actionHi: 'रिक्वेस्ट अस्वीकार करें, संदेश सुरक्षित रखें और पैसे जाने पर तुरंत 1930 पर कॉल करें।',
  },
  {
    id: 'fake-email',
    category: 'Phishing email',
    categoryHi: 'फिशिंग ईमेल',
    scenario: 'An email says your bank account will be closed in 10 minutes and asks you to click a link to “verify KYC”. What is the safest first step?',
    scenarioHi: 'एक ईमेल कहता है कि 10 मिनट में बैंक खाता बंद हो जाएगा और KYC “वेरिफाई” करने के लिए लिंक दिया गया है। सबसे सुरक्षित पहला कदम क्या है?',
    options: [
      'Click quickly before the deadline',
      'Reply with your OTP to prove you are the account holder',
      'Do not click; open the bank’s official app or type its known website yourself',
    ],
    optionsHi: [
      'डेडलाइन से पहले जल्दी से लिंक खोलेंगे',
      'अकाउंट होल्डर साबित करने के लिए OTP भेजेंगे',
      'लिंक न खोलकर बैंक का आधिकारिक ऐप या खुद टाइप की हुई वेबसाइट खोलेंगे',
    ],
    correctIndex: 2,
    explanation: 'Urgency, lookalike links, and requests for OTPs are common phishing signals. Verify through a trusted channel you open yourself.',
    explanationHi: 'जल्दी करने का दबाव, मिलते-जुलते लिंक और OTP माँगना फिशिंग के सामान्य संकेत हैं। जाँच हमेशा अपने भरोसेमंद चैनल से करें।',
    action: 'Report the email as phishing and delete it without opening attachments.',
    actionHi: 'ईमेल को फिशिंग के रूप में रिपोर्ट करें और अटैचमेंट खोले बिना मिटा दें।',
  },
  {
    id: 'digital-arrest',
    category: 'Digital arrest',
    categoryHi: 'डिजिटल अरेस्ट',
    scenario: 'Someone claiming to be police keeps you on a video call and demands money to avoid arrest. What is true?',
    scenarioHi: 'पुलिस अधिकारी बनकर कोई व्यक्ति वीडियो कॉल पर “डिजिटल अरेस्ट” करता है और गिरफ्तारी से बचने के लिए पैसे माँगता है। सही बात क्या है?',
    options: [
      'Real police can demand a security payment on video call',
      'It is a scam; end the call and verify independently',
      'Move money to a “safe account” provided by the caller',
    ],
    optionsHi: [
      'असली पुलिस वीडियो कॉल पर सुरक्षा राशि माँग सकती है',
      'यह ठगी है; कॉल काटकर स्वतंत्र रूप से जाँच करें',
      'कॉलर के बताए “सेफ अकाउंट” में पैसे भेजें',
    ],
    correctIndex: 1,
    explanation: 'Government officers do not place people under a video-call arrest or demand payment to cancel an arrest.',
    explanationHi: 'सरकारी अधिकारी वीडियो कॉल पर गिरफ्तारी नहीं करते और गिरफ्तारी रद्द करने के लिए पैसे नहीं माँगते।',
    action: 'End the call, tell a trusted person, and contact 1930 or local police through an official number.',
    actionHi: 'कॉल काटें, किसी भरोसेमंद व्यक्ति को बताएँ और 1930 या स्थानीय पुलिस के आधिकारिक नंबर पर संपर्क करें।',
  },
  {
    id: 'apk-remote-access',
    category: 'Fake KYC / APK',
    categoryHi: 'फर्जी KYC / APK',
    scenario: 'A message asks you to install an APK to update electricity KYC and share your screen. What should you do?',
    scenarioHi: 'एक संदेश बिजली KYC अपडेट करने के लिए APK इंस्टॉल करने और स्क्रीन शेयर करने को कहता है। आप क्या करेंगे?',
    options: [
      'Install it if the logo looks genuine',
      'Install it only after sharing your screen',
      'Do not install; use the provider’s official app or office instead',
    ],
    optionsHi: [
      'लोगो असली दिखे तो APK इंस्टॉल करेंगे',
      'स्क्रीन शेयर करने के बाद APK इंस्टॉल करेंगे',
      'इंस्टॉल न करके सेवा प्रदाता का आधिकारिक ऐप या कार्यालय इस्तेमाल करेंगे',
    ],
    correctIndex: 2,
    explanation: 'Unknown APKs and remote-screen access can expose passwords, OTPs, and banking sessions.',
    explanationHi: 'अनजान APK और रिमोट स्क्रीन एक्सेस से पासवर्ड, OTP और बैंकिंग सेशन चोरी हो सकते हैं।',
    action: 'Delete the message. If installed, disconnect from the internet, uninstall it, change passwords, and contact your bank.',
    actionHi: 'संदेश मिटाएँ। इंस्टॉल हो गया हो तो इंटरनेट बंद करें, ऐप हटाएँ, पासवर्ड बदलें और बैंक से संपर्क करें।',
  },
  {
    id: 'impersonation',
    category: 'Fake profile / harassment',
    categoryHi: 'फेक प्रोफाइल / उत्पीड़न',
    scenario: 'A fake social profile is using your name and threatening you. Which evidence is most useful?',
    scenarioHi: 'एक फेक सोशल प्रोफाइल आपके नाम का इस्तेमाल करके धमका रही है। कौन सा सबूत सबसे उपयोगी होगा?',
    options: [
      'Only a cropped screenshot with the URL hidden',
      'Original screenshots, messages, dates, and the exact profile URL',
      'Forwarding the intimate content to friends for advice',
    ],
    optionsHi: [
      'सिर्फ ऐसा क्रॉप्ड स्क्रीनशॉट जिसमें URL छिपा हो',
      'मूल स्क्रीनशॉट, संदेश, तारीख और सटीक प्रोफाइल URL',
      'सलाह के लिए निजी सामग्री दोस्तों को फॉरवर्ड करना',
    ],
    correctIndex: 1,
    explanation: 'Keep the original evidence and avoid forwarding private or intimate material. Report the account and preserve the URL.',
    explanationHi: 'मूल सबूत सुरक्षित रखें और निजी या अंतरंग सामग्री फॉरवर्ड न करें। अकाउंट रिपोर्ट करके URL सुरक्षित रखें।',
    action: 'Save evidence, report the account, block it, and use the social-incident reporting flow.',
    actionHi: 'सबूत सुरक्षित करें, अकाउंट रिपोर्ट और ब्लॉक करें, फिर सोशल-इंसिडेंट रिपोर्टिंग फ्लो इस्तेमाल करें।',
  },
];
