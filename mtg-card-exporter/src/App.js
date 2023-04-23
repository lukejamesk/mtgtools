import './App.css';
import { Accordion, AccordionDetails, AccordionSummary, Button, Card, CardContent, CardHeader, FormControl, FormControlLabel, FormLabel, Grid, Paper, Radio, RadioGroup, Snackbar, TextField, Typography } from '@mui/material';
import { useRef, useState } from 'react';
import { helvaultProCsvToTopDeckedConverter } from './helvaultProCsvToTopDeckedConverter';
import useCopyToClipboard from './useCopyToClipboard';
import { ExpandMore } from '@mui/icons-material';

const App = () => {
  const [copyValue, copy] = useCopyToClipboard()
  const [result, setResult] = useState();
  const [importVal, setImportVal] = useState();
  const [sourceVal, setSourceVal] = useState('helvault');
  const [targetVal, setTargetVal] = useState('topdecked');
  const [expanded, setExpanded] = useState('source');

  const targetEl = useRef(null);

  const handleOnClick = () => {
    const converted = helvaultProCsvToTopDeckedConverter(sourceVal, targetVal, importVal);
    setResult(converted);
    setExpanded('target');
    copy(converted)
  }

  const handleSelectConverted = () => {
    debugger
    targetEl.current.select();
  }

  const handleAccordionChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  }

  return (
    <div className="App">
      <Accordion
        expanded={expanded === 'source'}
        onChange={handleAccordionChange('source')} 
        expandIcon={<ExpandMore />}
      >
        <AccordionSummary
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography variant='h6'>1 - Source CSV</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Card elevation={5}>
            <CardHeader title="Import"></CardHeader>
            <CardContent>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Grid container>
                    <Grid item>
                      <FormControl>
                        <FormLabel>Import Source</FormLabel>
                        <RadioGroup
                          defaultValue={sourceVal}
                          name="Import Source"
                          onChange={(event) => {
                            setSourceVal(event.target.value);
                          }}
                        >
                          <FormControlLabel value="helvault" control={<Radio />} label="Helvault" />
                          <FormControlLabel value="topdecked" control={<Radio />} label="TopDecked" />
                          <FormControlLabel value="moxfield" control={<Radio />} label="MoxField" />
                        </RadioGroup>
                      </FormControl>
                    </Grid>
                    <Grid item>
                      <FormControl>
                        <FormLabel>Import Target</FormLabel>
                          <RadioGroup
                            defaultValue={targetVal}
                            name="Import Target"
                            onChange={(event) => {
                              setTargetVal(event.target.value);
                            }}
                          >
                            <FormControlLabel value="topdecked" control={<Radio />} label="TopDecked" />
                            <FormControlLabel value="moxfield" control={<Radio />} label="MoxField" />
                          </RadioGroup>
                      </FormControl>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs={12}>

                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <FormControl fullWidth>
                      <TextField
                          id="ImportText"
                          label="Import CSV"
                          multiline
                          fullWidth
                          minRows={10}
                          maxRows={25}
                          variant="filled"
                          value={importVal}
                          onChange={(event) => {
                            setImportVal(event.target.value);
                          }}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                      <Button fullWidth variant="contained"  color='primary' onClick={handleOnClick}>Convert</Button>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
          </AccordionDetails>
      </Accordion>
      <Accordion
        disabled={!result}
        expanded={expanded === 'target'}
        onChange={handleAccordionChange('target')}
        expandIcon={<ExpandMore />}
      >
        <AccordionSummary
          aria-controls="panel2a-content"
          id="panel2a-header"
        >
          <Typography variant='h6'>2 - Target CSV Result</Typography>
        </AccordionSummary>
        <AccordionDetails>
        {result && (
            <Card elevation={5}>
              <CardHeader
                title="Result"
                action={
                  <Button onClick={handleSelectConverted}>Select All Text</Button>
                }
              ></CardHeader>
              <CardContent>
                <FormControl fullWidth>
                    <TextField
                      id="ImportTargetText"
                      label="Import Target CSV"
                      inputRef={targetEl}
                      multiline
                      fullWidth
                      variant="filled"
                      minRows={10}
                      maxRows={25}
                      value={result}
                    ></TextField>
                  </FormControl>
                  <Snackbar
                    open={copyValue}
                    autoHideDuration={3000}
                    message="CSV has been copied to clipboard"
                  />
              </CardContent>
            </Card>
        )}
        </AccordionDetails>
      </Accordion>
    </div>
  );
}

export default App;
