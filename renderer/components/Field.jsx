import TextField from '@material-ui/core/TextField';

const Field = ({ label, placeholder, onChange, value, error, length }) => {
    return <TextField fullWidth 
                variant="outlined" 
                label={label}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                //error={settings.discordWebhook !== '' && !validWebhook}
                style={{
                  background: '#40444b',
                  //left:"10%"
                }}
                InputProps={{
                  style: {
                    color: "white",
                  }
          
                }}
                InputLabelProps={{
                  //shrink: value !== "",
                  style: {
                    color: "white",
                  }
                }}
                inputProps={{
                  maxLength: length
                }}
                error={error}
            />;
  };

export default Field;