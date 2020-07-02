import React, {Component} from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";

export default class EditExecise extends Component{
    constructor(props){
        super(props);

        this.onChangeDate=this.onChangeDate.bind(this);
        this.onChangeDescription=this.onChangeDescription.bind(this);
        this.onChangeUsername=this.onChangeUsername.bind(this);
        this.onChangeDuration=this.onChangeDuration.bind(this);
        this.getUsers=this.getUsers.bind(this);
        this.onSubmit=this.onSubmit.bind(this);

        this.state={
            username:'',
            description:'',
            duration:'',
            date:new Date(),
            users:[]
        };
    }

    componentDidMount(){ //como el ngOnInit()
        this.getExercise(this.props.match.params.id);
        this.getUsers()         
    }

    getUsers(){
        axios.get('http://localhost:5000/users/')
            .then(res=>{
                if(res.data.length>0){
                    this.setState({
                        users:res.data.map(user=>user.username)
                    })
                }
            })
    }

    getExercise(id){
        axios.get(`http://localhost:5000/excercises/${id}`)
            .then(res=>{
                this.setState({
                    username:res.data.username,
                    description:res.data.description,
                    date:new Date(res.data.date),
                    duration:res.data.duration
                })
            })
    }

    onChangeDescription(e) {
        this.setState({description:e.target.value});
    }

    onChangeDuration(e) {
        this.setState({duration:e.target.value});
    }

    onChangeDate(datepicker) {
        this.setState({date:datepicker});
    }

    onChangeUsername(e) {
        this.setState({username:e.target.value});
    }

    onSubmit(e){
        e.preventDefault();

        const exercise={
            username:this.state.username,
            description:this.state.description,
            duration:this.state.duration,
            date:this.state.date
        }
        console.log("exersice: ", exercise)

        axios.post('http://localhost:5000/excercises/update/'+this.props.match.params.id, exercise)
            .then(res=>console.log("Sent! ",res.data))
        
            window.location = '/';
    }


    render(){
        return(
            <div>
            <br></br>    
            <h3>Edit Exercise Log</h3>
            <form onSubmit={this.onSubmit}>
                <div className="form-group"> 
                <label>Username: </label>
                <select 
                    required
                    className="form-control"
                    value={this.state.username}
                    onChange={this.onChangeUsername}>
                    {
                        this.state.users.map(function(user) {
                        return <option 
                            key={user}
                            value={user}>{user}
                            </option>;
                        })
                    }
                </select>
                </div>
                <div className="form-group"> 
                <label>Description: </label>
                <input  type="text"
                    required
                    className="form-control"
                    value={this.state.description}
                    onChange={this.onChangeDescription}
                    />
                </div>
                <div className="form-group">
                <label>Duration (in minutes): </label>
                <input 
                    type="number" 
                    className="form-control"
                    value={this.state.duration}
                    onChange={this.onChangeDuration}
                    />
                </div>
                <div className="form-group">
                <label>Date: </label>
                <div>
                    <DatePicker
                    selected={this.state.date}
                    onChange={this.onChangeDate}
                    />
                </div>
                </div>

                <div className="form-group">
                <input type="submit" value="Edit Exercise Log" className="btn btn-primary" />
                </div>
            </form>
            </div>
        )
    }
}