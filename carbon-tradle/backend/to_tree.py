import json

def build_tree(data):
    """
    Transforms the raw emissions data (keyed by country code)
    into a hierarchical tree structure.

    Input structure (example):
    {
      "CHN": {
        "fossil-fuel-operations": {
          "coal-mining": 1291081091.9735577,
          "oil-and-gas-production": 166726322.66137594,
          "other-fossil-fuel-operations": 0.0,
          "oil-and-gas-refining": 170802982.80131853,
          "oil-and-gas-transport": 51974139.8795168,
          "sectorTotal": 1680584537.315769
        },
        ... other sectors ...
      },
      "CIV": { ... }
    }

    Output structure:
    {
      "CHN": {
         "name": "CHN",
         "children": [
            {
              "name": "fossil-fuel-operations",
              "value": 1680584537.315769,
              "children": [
                {"name": "coal-mining", "value": 1291081091.9735577},
                {"name": "oil-and-gas-production", "value": 166726322.66137594},
                ...
              ]
            },
            ... other sectors ...
         ]
      },
      "CIV": { ... }
    }
    """
    new_data = {}
    for country, sectors in data.items():
        # Create a root node for the country
        country_tree = {"name": country, "children": []}
        for sector, sub_dict in sectors.items():
            # Build a list of sub-sector nodes
            children = [
                {"name": sub_sector, "value": value}
                for sub_sector, value in sub_dict.items()
                if sub_sector != "sectorTotal"
            ]
            # Create the sector node with its total and children.
            sector_node = {
                "name": sector,
                "value": sub_dict.get("sectorTotal", 0),
                "children": children
            }
            country_tree["children"].append(sector_node)
        new_data[country] = country_tree
    return new_data

if __name__ == "__main__":
    # Adjust these filenames as needed.
    # input_filename = "file.json"               # Your raw emissions JSON file.
    input_filename = "subsector_breakdown.json"
    output_filename = "file_hierarchical.json"   # The output file with hierarchical data.

    # Load the raw JSON data.
    with open(input_filename, "r") as infile:
        raw_data = json.load(infile)
    print("Raw data loaded.")

    # Build the hierarchical tree.
    hierarchical_data = build_tree(raw_data)
    print("Hierarchical tree constructed.")

    # Write out the new JSON.
    with open(output_filename, "w") as outfile:
        json.dump(hierarchical_data, outfile, indent=2)
    print(f"Transformed data written to {output_filename}.")
