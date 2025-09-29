import pandas as pd
import matplotlib.pyplot as plt

# Load CSV
df = pd.read_csv("image_processing_times.csv")

# Plot Serial and Parallel Time
plt.figure(figsize=(12, 6))
plt.plot(df['N_Images'], df['Serial_Time'], marker='o', label='Serial Time')
plt.plot(df['N_Images'], df['Parallel_Time'], marker='s', label='Parallel Time')
plt.title('Serial vs Parallel Execution Time')
plt.xlabel('Number of Images')
plt.ylabel('Time (s)')
plt.grid(True)
plt.legend()
plt.tight_layout()
plt.show()

# Plot Speedup
plt.figure(figsize=(12, 6))
plt.plot(df['N_Images'], df['Speedup'], marker='^', color='green', label='Speedup')
plt.title('Speedup vs Number of Images')
plt.xlabel('Number of Images')
plt.ylabel('Speedup (x)')
plt.grid(True)
plt.legend()
plt.tight_layout()
plt.show()
