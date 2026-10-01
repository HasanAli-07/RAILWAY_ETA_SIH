import os, re

files = [
    'Dynamic_Train_ETA_Prediction_(1).txt',
    'Ohk_now_create_a_DETAILED_SRS_DOCUMENT_FOR_THIS_P_(1).txt',
    'UIUX_Specification._1._the_minimal_professional_o.txt'
]

for fname in files:
    print(f"\n==================== {fname} ====================")
    if not os.path.exists(fname):
        print("File does not exist!")
        continue
    with open(fname, 'r', encoding='utf-8') as f:
        text = f.read()

    # Find URLs
    urls = re.findall(r'https?://[^\s<>"]+', text)
    print("Found URLs:", urls)

    lines = text.split('\n')
    print(f"Total lines: {len(lines)}")

    keywords = ['http', 'www', 'github', 'kaggle', 'data', 'train', '12952', '12301', '22436', 'fois', 'ntes', 'rtis', 'schema', 'api', 'section']
    matches = [l.strip() for l in lines if any(k in l.lower() for k in keywords) and len(l.strip()) > 5]
    print(f"Key lines count: {len(matches)}")
    for m in matches[:20]:
        print("  ->", m[:140])
