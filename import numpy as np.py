import numpy as np
import matplotlib.pyplot as plt
from scipy.fft import fft
from sklearn.neural_network import MLPRegressor
import tkinter as tk
from tkinter import messagebox

# -----------------------------------------
# SAFE MATH FUNCTIONS (NO "np" NEEDED)
# -----------------------------------------

SAFE_FUNCTIONS = {
    "sin": np.sin,
    "cos": np.cos,
    "tan": np.tan,
    "exp": np.exp,
    "log": np.log,
    "sqrt": np.sqrt,
    "pi": np.pi
}

def get_ode_function(expr):
    expr = expr.replace("^", "**")

    def f(x, y):
        return eval(expr, {"__builtins__": {}}, {**SAFE_FUNCTIONS, "x": x, "y": y})

    return f

# -----------------------------------------
# RK4 SOLVER
# -----------------------------------------

def rk4(f, x0, y0, x_end, h):
    x_vals = [x0]
    y_vals = [y0]

    x = x0
    y = y0

    while x < x_end:
        k1 = h * f(x, y)
        k2 = h * f(x + h/2, y + k1/2)
        k3 = h * f(x + h/2, y + k2/2)
        k4 = h * f(x + h, y + k3)

        y = y + (k1 + 2*k2 + 2*k3 + k4)/6
        x = x + h

        x_vals.append(x)
        y_vals.append(y)

    return np.array(x_vals), np.array(y_vals)

# -----------------------------------------
# TRAIN ML MODEL
# -----------------------------------------

def train_model():
    X = []
    Y = []

    # Diverse training signals
    for _ in range(200):
        x = np.linspace(0.01, 1, 50)
        y = np.exp(x) + np.sin(x) + x**2

        fft_features = np.abs(fft(y))[:10]
        coeffs = np.polyfit(x, y, 5)

        X.append(fft_features)
        Y.append(coeffs)

    model = MLPRegressor(hidden_layer_sizes=(80, 80), max_iter=600)
    model.fit(X, Y)

    return model

# Train once
model = train_model()

# -----------------------------------------
# RUN SYSTEM
# -----------------------------------------

def run_system():
    try:
        expr = entry_ode.get()
        x0 = float(entry_x0.get())
        y0 = float(entry_y0.get())
        x_end = float(entry_xend.get())
        h = float(entry_step.get())

        f = get_ode_function(expr)

        # Solve ODE
        x, y = rk4(f, x0, y0, x_end, h)

        # DSP: FFT
        fft_features = np.abs(fft(y))[:10].reshape(1, -1)

        # ML Prediction
        coeffs = model.predict(fft_features)[0]

        # Approximation
        y_pred = np.polyval(coeffs, x)

        # Plot
        plt.figure()
        plt.plot(x, y, label="Numerical Solution (RK4)")
        plt.plot(x, y_pred, '--', label="DSP + ML Approximation")
        plt.legend()
        plt.title("Differential Equation Solver (DSP + ML)")
        plt.xlabel("x")
        plt.ylabel("y")
        plt.show()

    except Exception as e:
        messagebox.showerror("Error", str(e))

# -----------------------------------------
# GUI
# -----------------------------------------

root = tk.Tk()
root.title("DSP + ML Differential Equation Solver")
root.geometry("450x350")

tk.Label(root, text="Enter ODE y' = f(x,y)\n(e.g., sin(x)+y, x^2+y, y*cos(x))").pack()

entry_ode = tk.Entry(root, width=40)
entry_ode.insert(0, "x + y")
entry_ode.pack()

tk.Label(root, text="Initial x0:").pack()
entry_x0 = tk.Entry(root)
entry_x0.insert(0, "0")
entry_x0.pack()

tk.Label(root, text="Initial y0:").pack()
entry_y0 = tk.Entry(root)
entry_y0.insert(0, "1")
entry_y0.pack()

tk.Label(root, text="End of x:").pack()
entry_xend = tk.Entry(root)
entry_xend.insert(0, "1")
entry_xend.pack()

tk.Label(root, text="Step size (h):").pack()
entry_step = tk.Entry(root)
entry_step.insert(0, "0.02")
entry_step.pack()

tk.Button(root, text="Solve & Approximate", command=run_system).pack(pady=20)

root.mainloop()