import axios from "axios";

export const createProblem = async () => {
  try {
    const accessToken = process.env.ACCESS_TOKEN;
    const endpoint = process.env.ENDPOINT;

    const problemData = {
      name: 'Example',
      masterjudgeId: 1001
    };

    const response = await axios.post(`https://${endpoint}/api/v4/problems?access_token=${accessToken}`, problemData);

    if (response.status === 201) {
      console.log(response.data); // problem data
    } else {
      if (response.status === 401) {
        console.log('Invalid access token');
      } else if (response.status === 400) {
        console.log(`Error code: ${response.data.error_code}, details available in the message: ${response.data.message}`);
      }
    }
  } catch (error) {
    console.log('Connection problem');
  }
};

export const listProblems = async () => {
    try {
      const accessToken = process.env.ACCESS_TOKEN;
      const endpoint = process.env.ENDPOINT;
  
      const response = await axios.get(`https://${endpoint}/api/v4/problems?access_token=${accessToken}`);
  
      if (response.status === 200) {
        console.log(response.data); // list of problems
      } else {
        if (response.status === 401) {
          console.log('Invalid access token');
        }
      }
    } catch (error) {
      console.log('Connection problem');
    }
  };
  

 export  const updateProblem = async () => {
    try {
      const accessToken = process.env.ACCESS_TOKEN;
      const endpoint = process.env.ENDPOINT;
      const problemId = 42;
      const problemData = {
        name: 'New name'
      };
  
      const response = await axios.put(`https://${endpoint}/api/v4/problems/${problemId}?access_token=${accessToken}`, problemData);
  
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


 export  const deleteProblem = async () => {
    try {
      const accessToken = process.env.ACCESS_TOKEN;
      const endpoint = process.env.ENDPOINT;
      const problemId = 42;
  
      const response = await axios.delete(`https://${endpoint}/api/v4/problems/${problemId}?access_token=${accessToken}`);
  
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


export const createTestCase = async () => {
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
        `https://${endpoint}/api/v4/problems/${problemId}/testcases?access_token=${accessToken}`,
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
        `https://${endpoint}/api/v4/submissions?access_token=${accessToken}`,
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
  