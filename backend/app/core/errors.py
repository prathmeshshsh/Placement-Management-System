from fastapi import Request
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from starlette.exceptions import HTTPException as StarletteHTTPException
async def http_error(request:Request,exc:StarletteHTTPException):
 code="FORBIDDEN" if exc.status_code==403 else "NOT_FOUND" if exc.status_code==404 else "HTTP_ERROR"
 return JSONResponse(status_code=exc.status_code,content={"type":"about:blank","title":"Request failed","status":exc.status_code,"code":code,"detail":str(exc.detail),"instance":request.url.path,"requestId":getattr(request.state,"request_id","")})
async def validation_error(request:Request,exc:RequestValidationError):
 issues=[{"field":".".join(map(str,x["loc"][1:])),"code":x["type"],"message":x["msg"]} for x in exc.errors()]
 return JSONResponse(status_code=422,content={"type":"about:blank","title":"Validation failed","status":422,"code":"VALIDATION_FAILED","detail":"One or more fields are invalid.","instance":request.url.path,"requestId":getattr(request.state,"request_id",""),"fieldErrors":issues})
