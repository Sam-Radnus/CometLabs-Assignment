ENDPOINT="https://cometlab-assignment.onrender.com"

YT_Link for Demo="https://youtu.be/9MzY7ttPTWc"

## ROUTES FOR EVERYONE
- /api/signup  (POST)
- /api/login (POST)
- /api/questions/submit (POST for submitting a problem for evaluation)

## ROUTES FOR ADMIN ONLY  

- /api/questions (POST for creating problem)
- /api/questions (GET for getting problem list)
- /api/questions/:questionId (GET for getting a specific problem based on problem ID ) 
- /api/questions/:questionId (DELETE for deleting a specific problem based on problem ID)
- /api/questions/:questionId (PUT for updating a specific problem based on problem ID )
- /api/questions/:questionId/addTestCase (POST to add testcases for a specific problem based on problem ID)