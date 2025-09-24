# Truphone_API_UI
https://github.com/warjwarj/truphone_api_ui

## Info
This is a program that you can use to bulk-edit truphone SIMs through a web interface. This works for both the Tracker and DVR logins.

The system will know which login you're trying to target by the API key that you use. This can be found in: https://iot.truphone.com/settings/

Any attribute that you would normally edit by clicking on the 'Edit' button on an induvidual SIMs page in the web interface can be edited by entering it into a CSV file and uploading to the web interface. In the example below, the program would attempt to edit the Company and Tags fields for the SIMs 1111, 2222 and 3333. Make sure that you have the spelling correct and that the tags are seperated with a comma

|   ICCID       |        Company       |         Tags        |
| ------------- |:--------------------:|:-------------------:|
|     1111      |  XYZ Freight Ltd     |      Test1,Test2    |
|     2222      | Snail Speed Couriers |      ABC,QWERTY     |
|     3333      | Top Bloke Trucking   |       GPS,GSM       |

## Setup
You can either run this program with docker (recommended) or directly on the host machine. Download this as a zip file and 

### Docker
Install docker desktop: https://docs.docker.com/desktop/setup/install/windows-install/. You may also need to install WSL: https://learn.microsoft.com/en-us/windows/wsl/install although I think that docker installs this automatically.

Download this project and unzip it. Run docker desktop. Open a powershell window and run the following to check that it has installed correctly. You should see a version number.

```docker --version```

In that powershell window navigate to the project root directory. Create a file named ".env" (exactly) and open it with a text editor. In this file, enter the following text, replacing the marked area with the API key for that login which you want to work with. Save the file.

```TRUPHONE_API_KEY=<your api key>```

In the powershell window, still in the project root directory, run the command below. It will take some time, printing a lot of text to the terminal.

```docker-compose up --build -d```

Now you should see the containers running in docker desktop. In your browser navigate to http://localhost:3000 and you should see the web interface. The web interface should also be available on the LAN. Just navigate to the host machines ip address, with the port specified at the end like so: http://192.168.1.123:3000 and you should see the webpage.

### Without Docker
Install Node.js:  https://nodejs.org/en

Download this project and unzip it. Navigate to its root directory and open a command prompt. Run the below command to check that node has installed correctly. You should see a version number.

```node --version```

In each subfolder in the main project directory, "client" and "server", run this command. You'll need to open a seperate command prompt for each as the process will hang take up the use of the command prompt window:

```npm start```

Once both the client and server are running, open a browser window and navigate to http://localhost:3000. You should see the web interface. The web interface should also be available on the LAN. Just navigate to the host machines ip address, with the port specified at the end like so: http://192.168.1.123:3000 and you should see the webpage.
