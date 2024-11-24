### How to Run the Project

1. **Install Docker Desktop and Node.js**  
   Make sure you have Docker Desktop and Node.js installed on your machine.

2. **Clone the repository**  
   Clone the repository to your local machine and use the terminal to `cd` into the `client` and `container-monitor` folders.

3. **Install dependencies**  
   Run the command `npm install` in both the `client` and `container-monitor` folders to install all necessary dependencies.

4. **Navigate to the server folder**  
   Use the terminal to go back to the `server` folder.

5. **Build and start the Docker containers**  
   Run the following command to build and start the necessary containers:
   
   docker-compose up --build
 
6. **Verify container status**  
   Check the ports defined in the `docker-compose.yml` file. The containers should be running on those ports correctly.

7. **Start the client application**  
   Navigate to the `client` folder and run the following command to start the client application:

   npm run dev

8. **Database configuration**  
   For database configuration, please contact me at [dinhkien12112004@gmail.com].

---

### How to Run Docker Containers: Node Exporter, Grafana, Prometheus

1. **Access Prometheus**  
   Open Prometheus's port in your browser (check the port in `docker-compose.yml`).

2. **Verify Prometheus metrics**  
   Ensure Prometheus is collecting data from the `/metrics` endpoint of Node Exporter and cAdvisor. If the status shows "UP," it means they are running correctly.

3. **Set up Grafana**  
   - Log in to Grafana with the default credentials:  
     Username: `admin`, Password: `admin`.  
     You will be prompted to change the password after the first login.
   
   - Add a data source:  
     - Go to **Add Data Source** -> Select **Prometheus** -> Enter the Prometheus server URL: `http://prometheus:9090/` -> Click **Save and Test**.  
     If you see a green checkmark, it is set up correctly.

4. **Create Dashboards**  
   - Go to **Home** -> Select **Create Dashboard** -> **Import Dashboard**.
   - Enter the following dashboard IDs:
     - **1860** for Node Exporter.
     - **21743** for cAdvisor.

   - Name your dashboard and select the data source (the Prometheus instance you just set up).
   - Once done, your dashboard will be ready to use.