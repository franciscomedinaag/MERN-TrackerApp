import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import axios from 'axios';

const Exercise = props => ( //como no es class, solo acepta props y retorna jsx
    <tr>
      <td>{props.exercise.username}</td>
      <td>{props.exercise.description}</td>
      <td>{props.exercise.duration}</td>
      <td>{props.exercise.date.substring(0,10)}</td>
      <td>
        <Link to={"/edit/"+props.exercise._id}>edit</Link> | <a href="#" onClick={() => { props.deleteExercise(props.exercise._id) }}>delete</a>
      </td>
    </tr>
  )

export default class ExercisesList extends Component{
    constructor(props){
        super(props);

        this.deleteExercise=this.deleteExercise.bind(this);
        this.getExercises=this.getExercises.bind(this);
        this.state={exercises:[]};
    }

    componentDidMount(){
        this.getExercises();
    }

    getExercises(){
        axios.get('http://localhost:5000/excercises')
            .then(res=>{
                this.setState({exercises:res.data})
            })
            .catch((error)=>{
                console.log(error)
            })
    }

    deleteExercise(id){
        axios.delete(`http://localhost:5000/excercises/${id}`)
            .then(res=>console.log(res.data,id))
 
        this.setState({
            exercises:this.state.exercises.filter(el=>el._id!==id)//filter es mini foreach donde se quedan todos los quqe tengas id diferente al parametro
        })
    }

    exerciseList() {
        return this.state.exercises.map(currentexercise => {
          // aqui podria ir un if solo para retornar ciertos componentes Excercise
          return <Exercise exercise={currentexercise} deleteExercise={this.deleteExercise} key={currentexercise._id}/>;
          //retorna un componente por cada exercise al que se le mandan una funcion y dos variables
        })
    }

    render(){
        return(
            <div>
            <h3>Logged Exercises</h3>
            <table className="table">
              <thead className="thead-light">
                <tr>
                  <th>Username</th>
                  <th>Description</th>
                  <th>Duration</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                { this.exerciseList() }
              </tbody>
            </table>
          </div>
        )
    }
}