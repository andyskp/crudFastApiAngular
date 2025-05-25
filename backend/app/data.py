from .models import User

users_db = {}

default_user = User(username="admin", password="andres1234")
users_db[default_user.username] = default_user
tasks_db = []
task_id_counter = 1
