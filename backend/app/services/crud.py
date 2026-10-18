from sqlalchemy import select
from sqlalchemy.orm import Session
from fastapi import HTTPException
class CRUDService:
 def __init__(self,model):self.model=model
 def get(self,db:Session,key):
  obj=db.get(self.model,key)
  if obj is None:raise HTTPException(404,"Resource not found")
  return obj
 def list(self,db:Session,limit=50,offset=0):return list(db.scalars(select(self.model).limit(min(max(limit,1),100)).offset(max(offset,0))))
 def create(self,db:Session,**fields):
  obj=self.model(**fields);db.add(obj);db.flush();return obj
 def update(self,db:Session,obj,**fields):
  for key,value in fields.items():setattr(obj,key,value)
  db.flush();return obj
