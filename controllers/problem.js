import axios from "axios";
import Problem from "../models/Problem.js";



export const testAdmin=async(req,res)=>{
  const accessToken = process.env.ACCESS_TOKEN;
  const endpoint = process.env.ENDPOINT;
  if(accessToken==null || endpoint==null){
    console.log("missing data");
    res.status(500).json({message:"missing access token or endpoint"})
  }
  const url=`https://${endpoint}/api/v4/problems?access_token=${accessToken}`
  console.log(url);
  res.status(200).json({message:"success"})

}
export const createProblem = async (req,res) => {
  try {
    const accessToken = process.env.ACCESS_TOKEN;
    const endpoint = process.env.ENDPOINT;

    if(accessToken==null || endpoint==null){
      console.log("missing data");
      res.status(500).json({message:"missing access token or endpoint"})
    }
    const {name, body, typeId, masterjudgeId, interactive } = req.body;
    const problemData = {
      name: name,
      body:body,
      typeId:typeId,
      masterjudgeId: masterjudgeId,
      interactive:interactive
    };
    console.log(problemData);
    
    const response = await axios.post(`${endpoint}/api/v4/problems?access_token=${accessToken}`, problemData);
    console.log("Response received");

    if (response.status === 201) {
      console.log('Problem created successfully');
      console.log(response.data); // problem database
      problemData.id=response.data.id;
      saveProblemInDatabase(problemData);
      res.status(200).json({ response:response.data })
    } else {
      if (response.status === 401) {
        console.log('Invalid access token');
      
      } else if (response.status === 400) {
        console.log(`Error code: ${response.data.error_code}, details available in the message: ${response.data.message}`);
      }
      res.status(500).json({message:"some error occurred"})
    }
  } catch (error) {
    console.log('Connection problem');
    res.status(500).json({message:"some error occurred"})
  }
};

const saveProblemInDatabase=async(problemData)=>{
  try {
    const {name, body, typeId, masterjudgeId, interactive } = problemData;
        
    // Generate a unique code for the problem
    const currentTime = new Date();
    const accessToken = process.env.ACCESS_TOKEN;
    // Create the Problem object
    console.log(
      problemData.name+","+
      problemData.body+","+
      problemData.typeId+","+
      problemData.masterjudgeId+","+
      problemData.interactive+","+
      problemData.currentTime
    )
    
     const problem = new Problem({
       id: Math.floor(Math.random() * 1000), // Generate a random ID or use your own logic to assign an ID
       name:problemData.name,
       body:problemData.body,
       typeId:problemData.typeId,
       interactive:problemData.interactive,
       masterjudge: {
         id: problemData.masterjudgeId,
         name: 'Score is % of correctly solved sets',
         uri: `${process.env.ENDPOINT}/api/v4/judges/${problemData.masterjudgeId}?access_token=${accessToken}`
       },
       lastModified:currentTime,
     });

     // Save the Problem object to the database
     const createdProblem = await problem.save();
     console.log(createdProblem);
  } catch (error) {
    console.log(error);
  }
}
const getTypeName = (typeId) => {
  switch (typeId) {
    case 0:
      return 'binary';
    case 1:
      return 'minimize';
    case 2:
      return 'maximize';
    case 4:
      return 'percentage';
    default:
      return '';
  }
};
export const listProblems = async (req,res) => {
   console.log("list problems");
    try {
      const accessToken = process.env.ACCESS_TOKEN;
      const endpoint = process.env.ENDPOINT;
      if(accessToken==null){
        console.log("missing access token"); 
      }
      if(endpoint==null){
        console.log("missing endpoint");
      }
      console.log("calling API");
      console.log(`${endpoint}/api/v4/problems?access_token=${accessToken}`);
      const response = await axios.get(`${endpoint}/api/v4/problems?access_token=${accessToken}`);
      console.log("received response");
      console.log(response);
      if (response.status === 200) {
        console.log(response.data); // list of problems
        res.status(200).json({ response:response.data })
      } else {
        if (response.status === 401) {
          console.log('Invalid access token');
        }
        res.status(500).json({message:"some error occurred"})
      }
    } catch (error) {
      console.log('Connection problem');
      res.status(500).json({message:"some error occurred"})
    }
  };



 export  const updateProblem = async (req,res) => {
    try {
      const accessToken = process.env.ACCESS_TOKEN;
      const endpoint = process.env.ENDPOINT;
      const problemId = req.params.id;
      const problemData = {
        name: 'New name'
      };
  
      const response = await axios.put(`${endpoint}/api/v4/problems/${problemId}?access_token=${accessToken}`, problemData);
  
      if (response.status === 200) {
        console.log('Problem updated');
      } else {
        if (response.status === 401) {
          console.log('Invalid access token');
        } else if (response.status === 403) {
          console.log('Access denied');
        } else if (response.status === 404) {
          console.log('Problem does not exist');
        } else if (response.status === 400) {
          console.log(`Error code: ${response.data.error_code}, details available in the message: ${response.data.message}`);
        }
      }
    } catch (error) {
      console.log('Connection problem');
    }
  };

  export const getProblemById = async (req, res) => {
    try {
      const accessToken = process.env.ACCESS_TOKEN;
      const endpoint = process.env.ENDPOINT;
      const problemId = req.params.questionId; // Assuming the problemId is passed as a route parameter
      console.log("Getting Problem by ID")
      console.log(problemId);
      const response = await axios.get(`${endpoint}/api/v4/problems/${problemId}?access_token=${accessToken}`);
      
      if (response.status === 200) {
        const problemData = response.data;
        res.status(200).json(problemData);
      } else {
        if (response.status === 401) {
          console.log('Invalid access token');
          res.status(401).json({ error: 'Invalid access token' });
        } else if (response.status === 403) {
          console.log('Access denied');
          res.status(403).json({ error: 'Access denied' });
        } else if (response.status === 404) {
          console.log('Problem not found');
          res.status(404).json({ error: 'Problem not found' });
        }
      }
    } catch (error) {
      console.log('Connection problem');
      res.status(500).json({ error: 'Connection problem' });
    }
  };
 export  const deleteProblem = async (req,res) => {
    try {
      const accessToken = process.env.ACCESS_TOKEN;
      const endpoint = process.env.ENDPOINT;
      const problemId = req.params.id;
  
      const response = await axios.delete(`${endpoint}/api/v4/problems/${problemId}?access_token=${accessToken}`);
  
      if (response.status === 200) {
        console.log('Problem deleted');
      } else {
        if (response.status === 401) {
          console.log('Invalid access token');
        } else if (response.status === 403) {
          console.log('Access denied');
        } else if (response.status === 404) {
          console.log('Problem not found');
        }
      }
    } catch (error) {
      console.log('Connection problem');
    }
  };


export const createTestCase = async (req,res  ) => {
    try {
      const accessToken = process.env.ACCESS_TOKEN;
      const endpoint = process.env.ENDPOINT;
      const problemId = 42;
      const testcaseData = {
        input: 'Input',
        output: 'Output',
        timelimit: 5,
        judgeId: 1
      };
  
      const response = await axios.post(
        `${endpoint}/api/v4/problems/${problemId}/testcases?access_token=${accessToken}`,
        testcaseData
      );
  
      if (response.status === 201) {
        console.log(response.data); // testcase data
      } else {
        if (response.status === 401) {
          console.log('Invalid access token');
        } else if (response.status === 403) {
          console.log('Access denied');
        } else if (response.status === 404) {
          console.log('Problem does not exist');
        } else if (response.status === 400) {
          console.log(`Error code: ${response.data.error_code}, details available in the message: ${response.data.message}`);
        }
      }
    } catch (error) {
      console.log('Connection problem');
    }
  };

export const submitSolution = async (req, res) => {
    try {
      const accessToken = process.env.ACCESS_TOKEN;
      const endpoint = process.env.ENDPOINT;
      const { problemId, compilerId, source } = req.body;
  
      const submissionData = {
        problemId,
        compilerId,
        source
      };
  
      const response = await axios.post(
        `${endpoint}/api/v4/submissions?access_token=${accessToken}`,
        submissionData
      );
  
      if (response.status === 201) {
        const submissionData = response.data;
        // Check if the submission is correct
        if (submissionData.status === 0) {
          res.status(200).json({ message: 'Success', data: submissionData });
        } else {
          res.status(200).json({ message: 'Wrong', data: submissionData });
        }
      } else {
        if (response.status === 401) {
          res.status(401).json({ error: 'Invalid access token' });
        } else if (response.status === 402) {
          res.status(402).json({ error: 'Unable to create submission' });
        } else if (response.status === 400) {
          const errorData = response.data;
          res.status(400).json({ error: errorData.message });
        }
      }
    } catch (error) {
      res.status(500).json({ error: 'Connection problem' });
    }
  };
  