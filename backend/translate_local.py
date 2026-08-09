import os

def translate_labels():
    templates_dir = "/home/bhumit/fluxx3.0/backend/app/templates"
    src_path = os.path.join(templates_dir, "report_template_en.html")
    hi_path = os.path.join(templates_dir, "report_template_hi.html")
    mr_path = os.path.join(templates_dir, "report_template_mr.html")

    with open(src_path, "r", encoding="utf-8") as f:
        html = f.read()

    translations = [
        ("Air Quality Report", "वायु गुणवत्ता रिपोर्ट", "हवा गुणवत्ता अहवाल"),
        ("REPORT DATE", "रिपोर्ट तिथि", "अहवाल दिनांक"),
        ("WINDOW", "अवधि", "कालावधी"),
        ("READINGS", "रीडिंग्स", "नोंदी"),
        ("DATA POINTS", "डेटा पॉइंट्स", "डेटा पॉइंट्स"),
        ("AQI Dial", "एक्यूआई डायल", "AQI डायल"),
        ("Station Readout", "स्टेशन रीडआउट", "स्टेशन रीडआउट"),
        ("Red Zones", "रेड ज़ोन", "रेड झोन"),
        ("analyzed", "विश्लेषित", "विश्लेषण केले"),
        ("WHO limit", "WHO सीमा", "WHO मर्यादा"),
        ("Coverage", "कवरेज", "व्याप्ती"),
        ("rolling window", "रोलिंग विंडो", "रोलिंग विंडो"),
        ("Where 103 sits on the AQI scale", "AQI पैमाने पर वर्तमान स्थिति", "AQI स्केलवर वर्तमान स्थिती"),
        ("US EPA reference bands", "US EPA संदर्भ बैंड", "US EPA संदर्भ बँड"),
        ("Good<br>0–50", "अच्छा<br>0–50", "चांगले<br>0–50"),
        ("Moderate<br>51–100", "मध्यम<br>51–100", "मध्यम<br>51–100"),
        ("Sensitive<br>101–150", "संवेदनशील<br>101–150", "संवेदनशील<br>101–150"),
        ("Unhealthy<br>151–200", "अस्वस्थ<br>151–200", "अस्वस्थ<br>151–200"),
        ("V. Unhealthy<br>201–300", "बहुत अस्वस्थ<br>201–300", "अति अस्वस्थ<br>201–300"),
        ("Hazardous<br>300+", "खतरनाक<br>300+", "धोकादायक<br>300+"),
        ("Alert —", "चेतावनी —", "इशारा —"),
        ("Sensor Trends", "सेंसर रुझान", "सेन्सर कल"),
        ("Trend Over Time", "समय के साथ रुझान", "वेळेनुसार कल"),
        ("micrograms per cubic metre", "माइक्रोग्राम प्रति घन मीटर", "मायक्रोग्रॅम प्रति घनमीटर"),
        ("dashed line marks WHO guideline", "धराशायी रेखा WHO दिशानिर्देश को दर्शाती है", "तुटक रेषा WHO मार्गदर्शक तत्त्वे दर्शवते"),
        ("peak flagged at", "शिखर को चिह्नित किया गया", "उच्चांक येथे चिन्हांकित"),
        ("AQI by Location", "स्थान के अनुसार AQI", "स्थानानुसार AQI"),
        ("vs. nearby zones", "बनाम आस-पास के क्षेत्र", "विरुद्ध आसपासचे क्षेत्र"),
        ("this report", "यह रिपोर्ट", "हा अहवाल"),
        ("Daily AQI", "दैनिक AQI", "दैनिक AQI"),
        ("7-day high", "7-दिन का उच्चतम", "7-दिवसांचा उच्चांक"),
        ("Today (focus)", "आज (फोकस)", "आज (फोकस)"),
        ("Concentration", "एकाग्रता", "एकाग्रता"),
        ("parts per million", "भाग प्रति मिलियन", "भाग प्रति दशलक्ष"),
        ("measured vs. WHO guideline", "मापा गया बनाम WHO दिशानिर्देश", "मोजले विरुद्ध WHO मार्गदर्शक तत्त्वे"),
        ("measured", "मापा गया", "मोजले"),
        ("WHO annual guideline", "WHO वार्षिक दिशानिर्देश", "WHO वार्षिक मार्गदर्शक तत्त्वे"),
        ("is currently reading", "वर्तमान में पढ़ रहा है", "सध्या नोंदवत आहे"),
        ("the WHO annual PM2.5 guideline.", "WHO वार्षिक PM2.5 दिशानिर्देश का।", "WHO वार्षिक PM2.5 मार्गदर्शक तत्त्वे."),
        ("Historical Comparison", "ऐतिहासिक तुलना", "ऐतिहासिक तुलना"),
        ("Extended view", "विस्तारित दृश्य", "विस्तारित दृश्य"),
        ("beyond the 24h report window", "24 घंटे की रिपोर्ट विंडो के परे", "24 तास अहवाल विंडोच्या पलीकडे"),
        ("The source report covers the last 24 hours only. The trend below places today's reading in a longer 7‑day and 30‑day context.", 
         "स्रोत रिपोर्ट केवल पिछले 24 घंटों को कवर करती है। नीचे दिया गया रुझान आज की रीडिंग को लंबे 7-दिन और 30-दिन के संदर्भ में रखता है।",
         "स्रोत अहवाल केवळ मागील 24 तास कव्हर करतो. खालील कल आजची नोंद दीर्घ 7-दिवस आणि 30-दिवसांच्या संदर्भात ठेवतो."),
        ("7-Day Avg AQI", "7-दिन औसत AQI", "7-दिवस सरासरी AQI"),
        ("vs. today's", "बनाम आज का", "विरुद्ध आजचा"),
        ("30-Day Avg AQI", "30-दिन औसत AQI", "30-दिवस सरासरी AQI"),
        ("rolling monthly mean", "रोलिंग मासिक औसत", "रोलिंग मासिक सरासरी"),
        ("Best Day (7d)", "सर्वश्रेष्ठ दिन (7द)", "सर्वोत्तम दिवस (7दि)"),
        ("Worst Day (7d)", "सबसे खराब दिन (7द)", "सर्वात वाईट दिवस (7दि)"),
        ("7-Day AQI Trend", "7-दिन AQI रुझान", "7-दिवस AQI कल"),
        ("daily average AQI", "दैनिक औसत AQI", "दैनिक सरासरी AQI"),
        ("30-Day AQI Trend", "30-दिन AQI रुझान", "30-दिवस AQI कल"),
        ("dashed line marks 30-day average", "धराशायी रेखा 30-दिन का औसत दर्शाती है", "तुटक रेषा 30-दिवसांची सरासरी दर्शवते"),
        ("Full Environmental Report", "पूर्ण पर्यावरण रिपोर्ट", "पूर्ण पर्यावरण अहवाल"),
        ("Region:", "क्षेत्र:", "प्रदेश:"),
        ("Average AQI", "औसत AQI", "सरासरी AQI"),
        ("Processed across", "में संसाधित", "मध्ये प्रक्रिया केली"),
        ("observations", "अवलोकन", "निरीक्षणे"),
        ("Executive Summary", "कार्यकारी सारांश", "कार्यकारी सारांश"),
        ("Health risks:", "स्वास्थ्य जोखिम:", "आरोग्य धोके:"),
        ("people with respiratory or heart conditions, children, and the elderly face a heightened risk of aggravated asthma, reduced lung function, and cardiovascular strain.",
         "श्वसन या हृदय की स्थिति वाले लोग, बच्चे और बुजुर्ग अस्थमा के बढ़ने, फेफड़ों की कार्यक्षमता में कमी और हृदय संबंधी तनाव के बढ़ते जोखिम का सामना करते हैं।",
         "श्वसन किंवा हृदयाचे आजार असलेले लोक, मुले आणि वृद्धांना दमा वाढण्याचा, फुफ्फुसांचे कार्य कमी होण्याचा आणि हृदय व रक्तवाहिन्यासंबंधी ताण येण्याचा धोका जास्त असतो."),
        ("WHO / CPCB comparison:", "WHO / CPCB तुलना:", "WHO / CPCB तुलना:"),
        ("an AQI of 103 falls within the \"Unhealthy\" category — health effects may be felt even by people without pre-existing conditions, well past WHO's recommended ceiling of 50.",
         "103 का AQI \"अस्वस्थ\" श्रेणी में आता है — स्वास्थ्य प्रभाव उन लोगों द्वारा भी महसूस किए जा सकते हैं जिन्हें पहले से कोई बीमारी नहीं है, जो WHO की अनुशंसित 50 की सीमा से काफी अधिक है।",
         "103 चा AQI \"अस्वस्थ\" श्रेणीत येतो — आरोग्यावर होणारे परिणाम पूर्व-अस्तित्वात असलेल्या परिस्थिती नसलेल्या लोकांनाही जाणवू शकतात, जे WHO च्या शिफारस केलेल्या 50 च्या मर्यादेपेक्षा खूप जास्त आहे."),
        ("Likely pollution sources:", "संभावित प्रदूषण स्रोत:", "संभाव्य प्रदूषण स्रोत:"),
        ("heavy traffic congestion during peak hours, local industrial emissions, and ongoing construction activity in the area.",
         "पीक आवर्स के दौरान भारी ट्रैफ़िक जाम, स्थानीय औद्योगिक उत्सर्जन और क्षेत्र में चल रही निर्माण गतिविधि।",
         "पीक अवर्समध्ये होणारी वाहतूक कोंडी, स्थानिक औद्योगिक उत्सर्जन आणि परिसरातील सुरू असलेली बांधकामे."),
        ("Health Precautions", "स्वास्थ्य सावधानियां", "आरोग्य खबरदारी"),
        ("What to wear", "क्या पहनें", "काय घालावे"),
        ("Use N95 or equivalent masks when going outdoors to filter harmful particles.",
         "हानिकारक कणों को छानने के लिए बाहर जाते समय N95 या समकक्ष मास्क का उपयोग करें।",
         "हानिकारक कण फिल्टर करण्यासाठी घराबाहेर जाताना N95 किंवा तत्सम मास्क वापरा."),
        ("Windows", "खिड़कियां", "खिडक्या"),
        ("Keep windows closed to prevent outdoor pollution from infiltrating indoor air.",
         "बाहरी प्रदूषण को भीतरी हवा में घुसने से रोकने के लिए खिड़कियां बंद रखें।",
         "बाहेरील प्रदूषण घरातील हवेत घुसण्यापासून रोखण्यासाठी खिडक्या बंद ठेवा."),
        ("Outdoor exercise", "बाहरी व्यायाम", "बाहेरील व्यायाम"),
        ("Avoid outdoor exercise, especially during peak pollution hours.",
         "विशेष रूप से चरम प्रदूषण के घंटों के दौरान बाहरी व्यायाम से बचें।",
         "विशेषत: प्रदूषणाच्या सर्वोच्च वेळेत बाहेरील व्यायाम टाळा."),
        ("Schools &amp; outdoor events", "स्कूल और बाहरी कार्यक्रम", "शाळा आणि बाहेरील कार्यक्रम"),
        ("Postpone outdoor activities; parents should minimize children's exposure to outdoor air.",
         "बाहरी गतिविधियों को स्थगित करें; माता-पिता को बच्चों को बाहरी हवा के संपर्क में कम से कम रखना चाहिए।",
         "बाहेरील उपक्रम पुढे ढकला; पालकांनी मुलांना बाहेरील हवेच्या संपर्कात येणे कमी करावे."),
        ("Area-wise Summary", "क्षेत्र-वार सारांश", "क्षेत्रानुसार सारांश"),
        ("Trend Analysis", "रुझान विश्लेषण", "कल विश्लेषण"),
        ("Recommendations for Authorities", "अधिकारियों के लिए सिफारिशें", "अधिकार्यांसाठी शिफारसी"),
        ("Conclusion", "निष्कर्ष", "निष्कर्ष"),
        ("The situation in Camp Area demands immediate attention, particularly for vulnerable populations at increased risk from elevated pollution levels. Prompt action from residents and city authorities can meaningfully reduce health risks and improve air quality in the region.",
         "कैंप क्षेत्र की स्थिति पर तत्काल ध्यान देने की आवश्यकता है, विशेष रूप से ऊंचे प्रदूषण स्तरों से बढ़ते जोखिम वाली कमजोर आबादी के लिए। निवासियों और शहर के अधिकारियों द्वारा त्वरित कार्रवाई से स्वास्थ्य जोखिमों को सार्थक रूप से कम किया जा सकता है और क्षेत्र में हवा की गुणवत्ता में सुधार किया जा सकता है।",
         "कॅम्प एरियातील परिस्थितीकडे त्वरित लक्ष देण्याची गरज आहे, विशेषतः वाढत्या प्रदूषण पातळीमुळे वाढीव धोका असलेल्या असुरक्षित लोकसंख्येसाठी. रहिवासी आणि शहर अधिकाऱ्यांच्या त्वरित कारवाईमुळे आरोग्य धोके लक्षणीयरित्या कमी होऊ शकतात आणि प्रदेशातील हवेची गुणवत्ता सुधारू शकते."),
        ("ENVIRONMENTAL MONITORING", "पर्यावरण निगरानी", "पर्यावरण निरीक्षण"),
        ("REPORT GENERATED", "रिपोर्ट उत्पन्न की गई", "अहवाल व्युत्पन्न")
    ]

    hi_html = html
    mr_html = html

    for en, hi, mr in translations:
        hi_html = hi_html.replace(en, hi)
        mr_html = mr_html.replace(en, mr)

    with open(hi_path, "w", encoding="utf-8") as f:
        f.write(hi_html)

    with open(mr_path, "w", encoding="utf-8") as f:
        f.write(mr_html)

if __name__ == "__main__":
    translate_labels()
    print("Local translation script finished.")
