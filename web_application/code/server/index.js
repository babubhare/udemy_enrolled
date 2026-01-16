import express from 'express';
import cors from 'cors';
import axios from 'axios';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.post('/api/request', async (req, res) => {
  try {
    const { urls, headers } = req.body;

    if (!urls || !Array.isArray(urls) || urls.length === 0) {
      return res.status(400).json({ error: 'At least one URL is required' });
    }

    const requests = urls.map(url =>
      axios.get(url, {
        headers: headers || {},
        validateStatus: () => true,
      }).catch(error => ({
        error: true,
        message: error.message,
        url: url,
      }))
    );

    const responses = await Promise.all(requests);

    const mergedResults = [];
    const responseDetails = [];

    responses.forEach((response, index) => {
      if (response.error) {
        responseDetails.push({
          url: urls[index],
          status: 'error',
          error: response.message,
        });
      } else {
        responseDetails.push({
          url: urls[index],
          status: response.status,
          statusText: response.statusText,
        });

        if (response.data && response.data.results && Array.isArray(response.data.results)) {
          mergedResults.push(...response.data.results);
        } else if (Array.isArray(response.data)) {
          mergedResults.push(...response.data);
        }
      }
    });

    const firstSuccessfulResponse = responses.find(r => !r.error);

    res.json({
      status: firstSuccessfulResponse ? firstSuccessfulResponse.status : 'mixed',
      statusText: firstSuccessfulResponse ? firstSuccessfulResponse.statusText : 'Multiple Requests',
      headers: firstSuccessfulResponse ? firstSuccessfulResponse.headers : {},
      data: {
        results: mergedResults,
        responseDetails: responseDetails,
        totalRequests: urls.length,
        successfulRequests: responses.filter(r => !r.error).length,
      },
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
      details: error.response ? {
        status: error.response.status,
        data: error.response.data,
      } : null,
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
