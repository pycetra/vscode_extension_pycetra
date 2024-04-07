# %%
import json
import pathlib

import pandas as pd
from lib import graph2md, md2graph

current_dir = str(pathlib.Path(__file__).parent)
with open(current_dir+"/dat/in_sample.md","r") as f:
  text = f.read()

(link_f,node_f) = md2graph.main(text)


result = graph2md.main(link_f, node_f)

with open(current_dir+"/dat/out_002_1_sample.md","w") as f:
  f.write(result)

# %%
