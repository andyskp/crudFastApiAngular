from fastapi import FastAPI, HTTPException, Depends, Header
from backend.app import schemas, models, auth, data
from backend.app.default_data import default_tasks


from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:4200"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Cargar tareas por defecto

# Registro de usuarios
@app.post("/register")
def register(user: schemas.UserCreate):
    if user.username in data.users_db:
        raise HTTPException(status_code=400, detail="User already exists")
    data.users_db[user.username] = models.User(user.username, user.password)
    return {"msg": "User registered successfully"}

# Login
@app.post("/login", response_model=schemas.Token)
def login(user: schemas.UserCreate):
    db_user = data.users_db.get(user.username)
    if not db_user or not db_user.verify_password(user.password):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    token = auth.create_access_token({"sub": user.username})
    return {"access_token": token, "token_type": "bearer"}

# Autenticación
def get_current_user(authorization: str = Header(...)):
    if not authorization.startswith("Bearer "):
        raise HTTPException(status_code=403, detail="Invalid auth header")
    token = authorization.split(" ")[1]
    username = auth.verify_token(token)
    if not username or username not in data.users_db:
        raise HTTPException(status_code=403, detail="Invalid token")
    return username

# Crear tarea
@app.post("/tasks", response_model=schemas.Task)
def create_task(task: schemas.TaskCreate, user: str = Depends(get_current_user)):
    global_task_id = data.task_id_counter
    new_task = {"id": global_task_id, **task.dict()}
    data.tasks_db.append(new_task)
    data.task_id_counter += 1
    return new_task

# Leer tareas
@app.get("/tasks", response_model=list[schemas.Task])
def list_tasks(user: str = Depends(get_current_user)):
    return data.tasks_db

# Actualizar tarea
@app.put("/tasks/{task_id}", response_model=schemas.Task)
def update_task(task_id: int, task: schemas.TaskCreate, user: str = Depends(get_current_user)):
    for t in data.tasks_db:
        if t["id"] == task_id:
            t.update(task.dict())
            return t
    raise HTTPException(status_code=404, detail="Task not found")

# Eliminar tarea
@app.delete("/tasks/{task_id}")
def delete_task(task_id: int, user: str = Depends(get_current_user)):
    for t in data.tasks_db:
        if t["id"] == task_id:
            data.tasks_db.remove(t)
            return {"msg": "Task deleted"}
    raise HTTPException(status_code=404, detail="Task not found")

@app.get("/dashboard")
def show_dashboard(current_user: str = Depends(get_current_user)):
    return {
        "usuario": current_user.username,
        "tareas":default_tasks
    }
