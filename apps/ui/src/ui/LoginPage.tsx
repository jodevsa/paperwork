import React, {useState} from 'react'
import { Grid,Paper, Avatar, TextField, Button, Typography,Link } from '@material-ui/core'
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import {login} from "../reducers/app";
import { useDispatch } from 'react-redux';
export const LoginPage=()=>{


    const dispatch = useDispatch();
    const paperStyle={padding :5,height:'100vh', margin:"20px auto"}
    const avatarStyle={backgroundColor:'#1bbd7e'}
    const btnstyle={margin:'8px 0'}

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    return(
        <Grid>
            <Paper elevation={10} style={paperStyle}>
                <Grid align='center'>
                     <Avatar style={avatarStyle}><LockOutlinedIcon/></Avatar>
                    <h2>Sign In</h2>
                </Grid>
                <TextField label='Email' placeholder='Enter email' variant="outlined" fullWidth required onChange={(e)=>{
                        setEmail(e.target.value)
                }}/>
                <TextField value={password} label='Password' placeholder='Enter password' type='password' variant="outlined" fullWidth required onChange={(e)=>{
                    setPassword(e.target.value)
                }}/>
                <FormControlLabel
                    control={
                    <Checkbox
                        name="checkedB"
                        color="primary"
                    />
                    }
                    label="Remember me"
                 />
                <Button onClick={()=>{

                    dispatch(login({email,password}))


                }} type='submit' color='primary' variant="contained" style={btnstyle} fullWidth>Sign in</Button>
                <Typography >
                     <Link href="#" >
                        Forgot password ?
                </Link>
                </Typography>
                <Typography > Do you have an account ?
                     <Link href="#" >
                        Sign Up 
                </Link>
                </Typography>
            </Paper>
        </Grid>
    )
}
