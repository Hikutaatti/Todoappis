import {expect} from 'chai'

//define base_url
const base_url = 'http://localhost:3001/'

describe('POST Task',() => {
    it ('should post a task', async() =>{
        const response = await fetch(base_url + 'create',{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({'description':'Task from unit test'})
        })
        const data = await response.json()
        expect(response.status).to.equal(200)
        expect(data).to.be.an('object')
        expect(data).to.include.all.keys('id')
    })

    it ('should not post a task without description', async() =>{
        const response = await fetch (base_url +'create',{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({'description':null})
        })
        const data = await response.json()
        expect(response.status).to.equal(500)
        expect(data).to.be.an('object')
        expect(data).to.include.all.keys('error')
    })
})

describe('DELETE Task', () => {
    let taskId; // Store task ID to delete later

    before(async () => {
        // Create a task to delete
        const response = await fetch(base_url + 'create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 'description': 'Task to delete' })
        });
        const data = await response.json();
        taskId = data.id; // Capture the ID of the created task
        console.log('Created task ID:', taskId);  // Debugging line to check the created ID
    });

    it('should delete a task', async () => {
        // Ensure the taskId is valid
        expect(taskId).to.exist;

        const response = await fetch(`${base_url}delete/${taskId}`, {
            method: 'DELETE'
        });
        const data = await response.json();
        console.log('Delete response:', data);  // Debugging line to check the response
        expect(response.status).to.equal(200);
        expect(data).to.be.an('object');
        expect(data).to.include.all.keys('message'); // Should return a message key
        expect(data.message).to.equal('Task deleted successfully'); // Verify the success message
    });

    it('should return 404 when task is not found', async () => {
        const response = await fetch(base_url + 'delete/9999', { // A task ID that doesn't exist
            method: 'DELETE'
        });
        const data = await response.json();
        console.log('Delete response for non-existing task:', data);  // Debugging line for 404 case
        expect(response.status).to.equal(404);
        expect(data).to.be.an('object');
        expect(data).to.include.all.keys('error'); // Should return an error key
        expect(data.error).to.equal('Task not found');
    });
});