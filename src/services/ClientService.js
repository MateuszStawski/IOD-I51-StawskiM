import axios from 'axios'

const pravnaUrl = 'http://localhost:8081/'


class ClientService {
    async getClients(){
        try 
        {   
            return await axios({
                method: 'post',
                url: pravnaUrl + 'company/list',
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
