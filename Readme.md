
# Using existing Cognito user pool and identity pool with AWS amplify
With the new Amplify CLI, yyou gain the ability to import existing Amazon Cognito resources into your Amplify project. Just run the “amplify import auth” command and Amplify CLI will automatically configure all your Amplify-provisioned resources (GraphQL APIs, S3 buckets and more) to be authenticated with your designated existing Cognito User Pool or Identity Pool.  

## Pre-requisites:
    * NodeJS 14.x or later
    * Visual Studio Code
    * Install the latest Amplify CLI version using `npm install -g @aws-amplify/cli`
    * Amplify CLI is already configured with `amplify configure` command.

> [!NOTE]
> To use an existing Cognito user pool, you need to register two client applications in the **App Integration** section of the user pool. One for the web application client and another one for native application. Register the web application client without app secret and register the native client with app secret.

## Create a User pool with Web Client 
1) Sign in to the AWS management console and navigate to Cognito dashboard. Choose the region as `us-east-1`. Navigate to the new Console.
2) Click on the `Create User Pool` button.
3) In the `Configure sign-in experience` page, 
    1) `Cognito user pool` will be selected by default for Provider types. 
    2) For `Cognito user pool sign-in options` select `Username`,`email` and `Phone number`.
    3) Select the checkbox for `Allow users to sign in with a preferred user name` under `User name requirements`.
    4) Click on the `Next` button.
4) In the `Configure security requirements` page,
    1) Choose the `Password policy mode` as `Cognito defaults`.
    2) Choose `No MFA` for `Multi-factor authentication` setting.
    3) Under the `User account recovery`, select the checkbox for `Enable self-service account recovery - Recommended`. For `Delivery method for user account recovery messages` choose `Email if available, otherwise SMS`.
    4) Click on the `Next` button.
5) In the `Configure sign-up experience` page,
    1) Uncheck the checkbox for `Enable self-registration`.
    2) Do not modify anything for `Attribute verification and user account confirmation`.
    3) In the `Required attributes` section, choose the attributes choose `name`, `gender` and `phone_number` from the drop down list.
    4) Click on `Next` page.
6) In the `Configure message delivery` page,
    1) Under the `Email` configuration, select `Send email with Cognito` option. It is suitable for Dev/Test scenarios.
    2) For `SMS` configuration, Specify the name of an IAM role. If you have already cerated another role for a different User pool, you can select the existing role.
    3) Click on the `Next` button.
7) In the `Integrate your app` page,
    1) Specify user pool name as `EmployeeAppUserPool`.
    2) Under the `Hosted authentication pages`, select the `Use the Cognito Hosted UI` checkbox.
    3) In the `Domain` configuration page, select `Use a Cognito domain` option and enter a valid domain name prefix in the `Cognito domain` textbox.
    4) In the `Initial app client` section, select the `Public client` as the app type. 
    5) Specify client app name as `Employee Web Portal`.
    6) For the `client secret` choose the `Don’t generate a client secret` option. 
    7) In the `Allowed callback URLs` section, type `http://localhost` as the callback URL. When you build a client application, you can update it with the hosted URL of the client application.
    8) Expand the `Advanced app client settings` section and make sure `ALLOW_REFRESH_TOKEN_AUTH`, `ALLOW_CUSTOM_AUTH` and `ALLOW_USER_SRP_AUTH` authentication flows are selected. 
    9) Leave the token configuration parameters values as default.
    10) For `OAuth 2.0 Grant Types` select only `Implicit Grant`. 
    11) For `OpenID Connect scopes` select only `Email` and `Openid`.
    12) You can also review the `Attribute read and write permissions`. Click on the `Next` button.
8) In the `Review and create` page, verify all settings and click on the `Create User Pool` button.

9) After the user pool is created, you will be able to see it in the Cognito user pool dashboard. You can note the User pool ID value of the User pool you have created for configuring in the application.

## Register a native app client in user pool
1) Select the newly created user pool from the Cognito user pool dashboard.
2) Click on the `App integration` tab.
3) Scroll down to bottom and click on `create app client` button.
4) In the `App client` section, select the `Public client` as the app type. 
5) Specify client app name as `Employee Native App`.
6) For the `client secret` choose the `Generate a client secret - Recommended` option. 
7) For `authentication flows` select `ALLOW_REFRESH_TOKEN_AUTH`, `ALLOW_CUSTOM_AUTH` and `ALLOW_USER_SRP_AUTH` authentication options.
8) Leave the refresh token, id token and access token expiry values as default.
9) Under the `Hosted UI settings` section, type `http://localhost` for the `Allowed callback URLs` 
10) For `Identity providers`, `Cognito user pool` is by default selected.
11) For `OAuth 2.0 Grant Types` select only `Implicit Grant`. 
12) For `OpenID Connect scopes` select only `Email` and `Openid`.
13) You can also review the `Attribute read and write permissions`. Click on the `Create app client` button.

## Create users in the user pool
1) After you have successfully created the user pool, you need to navigate to the user pool by clicking on the user pool name.
2) In the User pool page, you can see the option for adding users under the `Users` tab.
3) Click on the `Create user` button to add a new user.
4) In the `Create user` page, select `Email` for the `Alias attributes used to sign in` option.
5) Choose `Don't send an invitation` option for `Invitation message`.
6) Specify the user name in the username textbox. Also specify an email and select the `Mark email address as verified` checkbox. Specify the phone number and select the `Mark phone number as verified` checkbox.
7) For the `Temporary password` section selet the `Set a password` option and type an initial password in the password textbox. This password need to be changed in the initial login.
8) Click on the `Create user ` button to create the user.
9) You can add more number of users by following the same steps mentioned above.

## Create an identity pool
1) Open AWS management console and navigate to Cognito console.
2) Click on `Federated Identities` to create identity pool.
3) Specify the identity pool name as `EmployeeAppIdentityPool`.
4) Scroll down to the `Authentication providers ` section and select the `Cognito` tab.
    1) Enter the User pool id of the previously created `EmployeeAppUserPool` user pool.
    2) Enter the `Employee Web Portal` client app Id.
5) Click on `Add another provider`.
    1) Enter the User pool id of the previously created `EmployeeAppUserPool` user pool.
    2) Enter the `Employee Native App` client app Id.
6) Click on `Create Pool` button.
7) Click on the `Allow` to create the identity pool.

## Setupd the backend REST API authentication with Cognito User Pool
1) Open the `employee-api-starter` project in Visual Studio Code.
2) Restore all node packages by running `npm install` command.
3) Install the following npm package to support Cognito authentication.
    ```bash
    npm install --save cognito-express
    ```
4) Create `auth.js` file in the project root folder and add the following code.
    ```javascript
    const CognitoExpress = require('cognito-express')

    // Setup CognitoExpress
    const cognitoExpress = new CognitoExpress({
        region: process.env.REGION,
        cognitoUserPoolId: process.env.COGNITO_USER_POOL_ID,
        tokenUse: "access",
        tokenExpiration: 3600
    })
    
    exports.validateAuth = (req, res, next) => {
        // Check that the request contains a token
        if (req.headers.authorization && req.headers.authorization.split(" ")[0] === "Bearer") {
            // Validate the token
            const token = req.headers.authorization.split(" ")[1]
            cognitoExpress.validate(token, function (err, response) {
                if (err) {
                    // If there was an error, return a 401 Unauthorized along with the error
                    res.status(401).send(err)
                } else {
                    //Else API has been authenticated. Proceed.
                    next();
                }
            });
        } else {
            // If there is no token, respond appropriately 
            res.status(401).send("Access denied, check the access token is sent correctly.")
        }
    }
    ```
5) Open the `routes/employee-routes.js` file and add the following import statement on top.
    ```javascript
    const { validateAuth } = require('../auth')
    ```
6) Update the route for adding a new employee to support JWT token authentication. Use the `validateAuth` middileware for the route to validate JWT token sent by the client application.
    ```javascript
    router.post("/",[validateAuth], async(req,res)=>{
        let employee = req.body;
        let result = await empSvc.addEmployee(employee)
            .catch(err=>{
                console.log(err);
                res.status(500).json({'message':'Unable to add new employee'})
            })
        if(result)
        {
            res.status(201).json({'message':'Employee added successfully'})
        }
    })
    ```
7) Update the `serverless.yml` file to specify the Cognito user pool id which you have created above.
    ```yml
    environment:
        TABLENAME: ${self:custom.tableName}
        NODE_ENV: 'production'
        REGION: 'REGION_HERE'
        COGNITO_USER_POOL_ID: 'USER_POOL_ID_HERE'
    ```
8) Deploy the backend API using the following command.
    ```bash
    serverless deploy
    ```
## Configure React applciation with Amplify
1) Open the project `employee-portal-starter` using VS Code.
2) Open the command terminal in the project folder.
3) Initialize the Amplify in the current project folder.
    ```nodejs
    amplify init
    ``` 
    ```
    Note: It is recommended to run this command from the root of your app directory
    ? Enter a name for the project :employeeportal
    The following configuration will be applied:

    Project information
    | Name: employeeportal
    | Environment: dev
    | Default editor: Visual Studio Code
    | App type: javascript
    | Javascript framework: react
    | Source Directory Path: src
    | Distribution Directory Path: build
    | Build Command: npm.cmd run-script build
    | Start Command: npm.cmd run-script start

    ? Initialize the project with the above configuration? No
    ? Enter a name for the environment :prod
    ? Choose your default editor: Visual Studio Code
    ? Choose the type of app that you're building javascript
    Please tell us about your project
    ? What javascript framework are you using react
    ? Source Directory Path:  src
    ? Distribution Directory Path: build
    ? Build Command:  npm.cmd run-script build
    ? Start Command: npm.cmd run-script start
    Using default provider  awscloudformation
    ? Select the authentication method you want to use: AWS profile
    For more information on AWS Profiles, see:
    https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-profiles.html

    ? Please choose the profile you want to use : default
    Adding backend environment prod to AWS Amplify app: d29a0v7ge07a4o
    | Initializing project in the cloud...
    ```

4) Import the cognito resources by running the following command:
    ```bash
    amplify import auth
    ```

    ```
    Using service: Cognito, provided by: awscloudformation
    √ What type of auth resource do you want to import? · Cognito User Pool and Identity Pool
    ✔ Only one Cognito User Pool (ap-south-1_Pj5phYg8U) found and it was automatically selected.
    ✔ Only one Web app client found: 'Employee Web Portal' was automatically selected.
    The User Pool has multiple Native app clients configured.
    √ Select a Native client to import: · 13lu68v3iao9q018f2uq03ka1o
    ✔ Only one Identity Pool resource found: 'EmployeeAppIdentityPool' (ap-south-1:982178eb-0983-42e8-9065-3666b41df1e7) was automatically selected.

    ✅ Cognito User Pool 'EmployeesUserPool' and Identity Pool 'EmployeeAppIdentityPool' was successfully imported.

    Next steps:
    - This resource will be available for GraphQL APIs ('amplify add api')
    - Use Amplify libraries to add signup, signin, signout capabilities to your client application.
        - iOS: https://docs.amplify.aws/lib/auth/getting-started/q/platform/ios
        - Android: https://docs.amplify.aws/lib/auth/getting-started/q/platform/android
        - JavaScript: https://docs.amplify.aws/lib/auth/getting-started/q/platform/js
    ```
5) Now that we’ve imported our Cognito resource into our Amplify project, let’s start to leverage it within our UI. Let’s generate the configuration files by running:
    ```bash
    amplify push
    ```
6) Accept all the default values for the prompted questions. You should see a new `aws-exports.js` file in the `src/` folder with the Cognito resource information. Your `aws-exports.js` file should look something like this:
    ```json
    const awsmobile = {
      "aws_project_region": "YOUR_REGION",
      "aws_cognito_identity_pool_id": "YOUR_IDENTITY_POOL_ID",
      "aws_cognito_region": "YOUR_REGION",
      "aws_user_pools_id": "YOUR_USER_POOL_ID",
      "aws_user_pools_web_client_id": "YOUR_USER_POOL_WEB_CLIENT_ID",
      "oauth": {}
    };
    ```
7) Add the following npm packages to generate the Login and Signup ui elements for  your application
    ```nodejs
    npm install
    npm install --save aws-amplify @aws-amplify/ui-react
    ```
8) Open the App.js file in your react application and add the following code below all import statements
    ```javascript
    import { Amplify } from 'aws-amplify';
    import { Authenticator } from '@aws-amplify/ui-react';
    import '@aws-amplify/ui-react/styles.css';
    import awsExports from './aws-exports';
    Amplify.configure(awsExports);
    ```
9) Update the App component code with the following. This will add a signout link and shows currently logged in user name in the navigation bar.
    ```javascript
    function App({ loadEmployees }) {
        loadEmployees();
    
        return (
            <Authenticator loginMechanisms={['username']}>
                {({ signOut, user }) => (
                    <Router>
                        <Navbar bg="dark" variant="dark">
                            <Container>
                                <Navbar.Brand href="#home">{process.env.REACT_APP_APP_NAME}</Navbar.Brand>
                                <Nav className="me-auto">
                                    <Nav.Link as={Link} to="/" >Home</Nav.Link>
                                    <Nav.Link as={Link} to="/about">About</Nav.Link>
                                    <Nav.Link as={Link} to="/contact">Contact</Nav.Link>
                                    <Nav.Link onClick={signOut}>Sign out</Nav.Link>
                                    <Nav.Link href ="#" > Welcome {user.username}</Nav.Link> 
                                </Nav>
                            </Container>
                        </Navbar>
                        <div>
                            <Routes>
                                <Route exact path="/" element={<Home />}></Route>
                                <Route exact path="about" element={<About />}></Route>
                                <Route exact path="contact" element={<Contact />}></Route>
                                <Route exact path="employees/loc/:locId/ecode/:ecode" element={<EmployeeDetail />}></Route>
                                <Route exact path="employees/create" element={<EmployeeForm />} ></Route>
                                <Route path="*" element={<Navigate to="/" />} />
                            </Routes>
                        </div>
                    </Router>
                )}
            </Authenticator>
        );
    }
    ```
10) Now, you can test the applciation locally by running the following commnad.
    ```bash
    npm start
    ```

## Consume protected APIs with Access Token
1) Open `src/components/EmployeeForm.jsx` file in the project.
2) Update the `handleSubmit()` code with the following
    ```javascript
    async handleSubmit(e) {
        e.preventDefault();
        let session = await Auth.currentSession()
            .catch(err => console.log("Unable to get access token"))
        if (session) {
            let token = session.getAccessToken().getJwtToken();
            const { employee } = this.state;
            this.props.addEmployee(employee, token);
            this.setState({ redirect: true });
        }
        else {
            alert("User not logged in")
        }
    }
    ```
3) Now, open the `src/actions/action-creators.js` file.
4) Update the `addEmployee` method with the following. This will use the access token to call the backend API.
    ```javascript
    export function addEmployee(employee, accessToken) {
        return async (dispatch) => {
            try {
                let options = { headers: { "Authorization": `Bearer ${accessToken}` } }
                let result = await axios.post(API_URL, employee, options);//adding to database but not to inmemory state
                //update the state with dispatching an ADD_EMPLOYEE action
                dispatch({
                    type: ActionTypes.ADD_EMPLOYEE,
                    payload: employee
                })
                return Promise.resolve(result.data);
            } catch (err) {
                return Promise.reject(err);
            }
        }
    }
    ```

5) Run and test the application
    ```bash
    npm start
    ```
