import os
import json
import pandas as pd
from pathlib import Path

def convert_csv_to_json(root_dir):
    root_path = Path(root_dir)
    count = 0
    for csv_file in root_path.rglob("*.csv"):
        # Skip if it's in a virtual environment or node_modules or dist
        if "venv" in csv_file.parts or "node_modules" in csv_file.parts or "dist" in csv_file.parts:
            continue
            
        print(f"Processing: {csv_file}")
        try:
            df = pd.read_csv(csv_file)
            json_file = csv_file.with_suffix('.json')
            
            # Convert to list of dicts and save
            records = df.to_dict(orient="records")
            with open(json_file, 'w', encoding='utf-8') as f:
                json.dump(records, f, indent=2, ensure_ascii=False)
                
            print(f"  -> Saved {len(records)} records to {json_file}")
            count += 1
        except Exception as e:
            print(f"  -> Failed to convert {csv_file}: {e}")
            
    print(f"Successfully converted {count} CSV files to JSON in {root_dir}")

if __name__ == "__main__":
    base_dir = os.path.dirname(os.path.abspath(__file__))
    project_root = os.path.dirname(base_dir) # fluxx3.0
    
    backend_data = os.path.join(base_dir, "data")
    frontend_public = os.path.join(project_root, "frontend", "public")
    
    print("Converting Backend Data...")
    convert_csv_to_json(backend_data)
    
    print("\nConverting Frontend Public Data...")
    convert_csv_to_json(frontend_public)
