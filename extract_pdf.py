import sys, re

# Set stdout encoding to utf-8
sys.stdout.reconfigure(encoding='utf-8')

def parse_pdf_stream(filename):
    print(f"\n==================== {filename} ====================")
    with open(filename, 'rb') as f:
        data = f.read()

    # Extract all URLs directly from binary
    raw_urls = re.findall(rb'https?://[^\s<>"{}|\\^`\)\(\]\[]+', data)
    urls = sorted(list(set([u.decode('utf-8', errors='ignore') for u in raw_urls])))

    print(f"--- URLS FOUND ({len(urls)}) ---")
    for u in urls:
        print("  *", u)

    # Search for train numbers, dataset references, websites, Kaggle, NTES, FOIS
    print("\n--- KEYWORD MATCHES IN PDF ---")
    keywords = [rb'http', rb'www', rb'github', rb'kaggle', rb'data', rb'train', rb'indianrail', rb'cris', rb'fois', rb'ntes', rb'rtis', rb'dataset']
    for kw in keywords:
        matches = re.findall(rb'.{0,40}' + kw + rb'.{0,40}', data, re.IGNORECASE)
        print(f"\nKeyword '{kw.decode()}': {len(matches)} matches")
        for m in matches[:10]:
            try:
                print("   ->", m.decode('utf-8', errors='ignore').strip())
            except:
                pass

parse_pdf_stream('Dynamic Train ETA Prediction (1).pdf')
parse_pdf_stream('Ohk now create a DETAILED SRS DOCUMENT FOR THIS P... (1).pdf')
parse_pdf_stream('UIUX Specification._1. the minimal professional o....pdf')
