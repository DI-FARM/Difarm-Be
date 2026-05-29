# Difarm-Be
this is backend repo for DI-FARM

## Free port 4000 (when "address already in use")

**Step 1** – Find the process ID (PID) using port 4000:
```powershell
netstat -ano | findstr :4000
```
In the output, find the line with `LISTENING` and note the number in the **last column** (e.g. `31288`). That is your PID.

**Step 2** – Stop that process (replace `31288` with your actual PID):
```powershell
taskkill /PID 31288 /F
```
Then run `npm run dev` again.
