import axios from 'axios'

const CLIENT_API_BASE_URL = 'http://54.37.234.76:8081/company/list'


class ClientService {
    async getClients(){
        try 
        {   
            return await axios({
                method: 'post',
                url: CLIENT_API_BASE_URL,
                headers: {}, 
                data: {
                    token: localStorage.getItem('token'),
                    status: localStorage.getItem('filter'), // This is the body part
                    pageNumber: localStorage.getItem('pageNumber')
                }
              });
        }
        catch (error) {
            //pass
        }
        }
    }



export default new ClientService()
