from tkinter import *

def login():
    usuario = entry_usuario.get()
    contrasena = entry_contrasena.get()
    print(f"Usuario: {usuario}, Contraseña: {contrasena}")  # para pruebas

def registrarse():
    print("Ir a pantalla de registro...")  # más adelante podés abrir otra ventana

root = Tk()
root.title("Login")
root.geometry("400x300")

# Etiqueta y entrada para el usuario
lbl_usuario = Label(root, text="Usuario:")
lbl_usuario.grid(row=0, column=0, padx=10, pady=10, sticky=E)
entry_usuario = Entry(root)
entry_usuario.grid(row=0, column=1, padx=10, pady=10)

# Etiqueta y entrada para la contraseña
lbl_contrasena = Label(root, text="Contraseña:")
lbl_contrasena.grid(row=1, column=0, padx=10, pady=10, sticky=E)
entry_contrasena = Entry(root, show="*")
entry_contrasena.grid(row=1, column=1, padx=10, pady=10)

# Botón para iniciar sesión
btn_login = Button(root, text="Iniciar sesión", command=login)
btn_login.grid(row=2, column=0, columnspan=2, pady=20)

# Texto de registro y botón
lbl_registro = Label(root, text="¿No tenés cuenta?")
lbl_registro.grid(row=3, column=0, padx=10, pady=10, sticky=E)

btn_registro = Button(root, text="Registrate aquí", command=registrarse)
btn_registro.grid(row=3, column=1, padx=10, pady=10, sticky=W)

root.mainloop()
