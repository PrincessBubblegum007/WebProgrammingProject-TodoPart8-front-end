import { Task } from './Task.js';

class Todos {
    #tasks = [];
    #backendUrl = '';  

    constructor(url) {
        this.#backendUrl = url;
    }

    getTasks = () => {
        return new Promise(async (resolve, reject) => {
            fetch(this.#backendUrl + '/')
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.json();
                })
                .then((json) => {
                    if (Array.isArray(json)) {
                        this.#readJson(json);
                        resolve(this.#tasks);
                    } else {
                        throw new Error('Invalid data format received');
                    }
                })
                .catch((error) => {
                    reject(error);
                });
        });
    }

    addTask = (text) => {
        return new Promise(async (resolve, reject) => {
            const json = JSON.stringify({ description: text });
            fetch(this.#backendUrl + '/new', {  
                method: 'post',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: json
            })
            .then(response => response.json())
            .then((json) => {  
                const task = new Task(json.id, text);
                this.#tasks.push(task);
                resolve(task);
            }, (error) => {
                reject(error);
            })
        });
    };

    removeTask = (id) => {
        return new Promise(async(resolve, reject) => {
          fetch(this.#backendUrl + '/delete/' + id,{
            method: 'delete'
          })
          .then((response) => response.json())
          .then((json) => {
            this.#removeFromArray(id)
            resolve(json.id)
          },(error) => {
            reject(error)
          })
        })
      }
      

    #readJson = (tasksAsJson) => {
        if (!Array.isArray(tasksAsJson)) {
            console.error('Expected array of tasks, got:', tasksAsJson);
            return;
        }
        this.#tasks = []; // Clear existing tasks
        tasksAsJson.forEach(node => {
            const task = new Task(node.id, node.description);
            this.#tasks.push(task);
        });
    }

    #removeFromArray =(id) => {
        const arrayWithoutRemoved = this.#tasks.filter(task => task.id !== id)
        this.#tasks = arrayWithoutRemoved
      }
      
}

export { Todos };