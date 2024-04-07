# %%
import json
import pathlib

import pandas as pd
from lib import md2graph

current_dir = str(pathlib.Path(__file__).parent)
with open(current_dir+"/dat/in_sample.md","r") as f:
  text = f.read()

(link_f,node_f) = md2graph.main(text)

js_string = json.dumps({'node_feature':pd.DataFrame(node_f).to_dict("list"),
                        'link_feature':pd.DataFrame(link_f).to_dict("list")},
                        separators=(',', ':'))

with open(current_dir+"/dat/out_sample.md","w") as f:
  f.write(js_string.replace("0.0","0"))

# %%
