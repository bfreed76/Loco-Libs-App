import React, { useState, useEffect } from 'react'
import Inputs from '../Components/Inputs'
import Story from '../Components/Story'
import Header from '../Components/Header'


const StoryContainer = (props) => {
    const [finished, setFinished] = useState(false)
    const [saved, setSaved] = useState(false)
    const [user, setUser] = useState("")
    const [userID, setUserID] = useState()
    const [input, setInput] = useState({})
    const [story, setStory] = useState("")
    const {title, blanks, value} = props.storyText

    const inputToState = (e) => {               //? SETS USER INPUT TO STATE
        e.preventDefault()
        const {name, value} = e.target
        setInput(prevState => {return {...prevState, [name]: value}})  
    }

    const displayBlanks = () => {               //? DISPLAYS USER INPUTS
        if(blanks) {
            return blanks.map((blank, id) => {
                return <Inputs blank={blank} key={id} inputToState={inputToState} id={id}/>
                }
            )
        } 
    }

    const zipStory = () => {                    //? ZIPS USER INPUT AND STORIES
        setFinished(true)
        let counter = 0
        value.pop()
        let mapping = value.map((line) => {
            let concat
            concat = input[counter] ? concat = line + input[counter] : line
            counter += 1
            return concat
        })
        let finishedStory = mapping.join("")
        setStory(finishedStory)
    }
    
    const newStoryClick = () => {                 //? FETCHES NEW STORY
        setFinished(false)
        setSaved(false)
        return props.newStory()
    }
    
    const usernameToState = (e) => {               //? SETS USERNAME TO STATE
        e.preventDefault()
        let userName = e.target.value
        setUser(prev => {return {...prev, userName}}) 
    }

    const saveStory = (e) => {                      //? POSTS USERNAME AND ZIPPED STORY
        e.preventDefault()
        const requestOptionsUser = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                name: user.userName  
            })};
        const requestOptionsStory = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                title: title,
                author: user.userName,
                content: story,
                user_id: userID
            })};
        const requestOptionsWord = {    //! save words via map function tied to button
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                word: input 
            })};
        fetch("http://localhost:9393/users", requestOptionsUser)
            .then(res => res.json())
            .then(data => {setUserID(data.id); console.log(data)})
            .then(fetch("http://localhost:9393/stories", requestOptionsStory)
                        .then(res => res.json())
                        .then(data => console.log(data)))

        // fetch("http://localhost:9393/words", requestOptionsWord)
        //     .then(res => res.json())
        //     .then(data => console.log(data))
        setSaved(true)
    }

    return (
        <div>
            <Header newStoryClick={newStoryClick} title={title}/>
            {!finished ?                
                [displayBlanks(), <br></br>, <button onClick={zipStory}>FINISHED</button>] :
                <Story finishedStory={story} usernameToState={usernameToState} saveStory={saveStory}/>}
            {saved ?
                <h2>STORY SAVED</h2> :
                null}
        </div>
    )
}

export default StoryContainer