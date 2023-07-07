import { useState } from "react";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import StepContent from "@mui/material/StepContent";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { ThemeProvider } from "@material-ui/core/styles";

import { thirdEyesTheme } from "/components/themes/thirdEyesTheme";

const steps = [
  {
    label: "Select Projects",
    description: `Currently, the only style guide I shared with you is for
     Hetfield, but eventually there will be other projects with other style guides.`,
    buttons: [
      { buttonLabel: "Hetfield", buttonValue: "hetfield" },
      { buttonLabel: "Ulrich", buttonValue: "ulrich" },
    ],
  },
  {
    label: "Select Work Type",
    description: `Work types are specific types of assignments that we're given. 
      Examples of these are Essential Album Review Notes, Collections Notes, Artist 
      Bios, etc. For some of these work types, there are multiple variations.`,
  },
  {
    label: "Select Writer",
    description: `Since we've been orienting around Philip, let's just use him 
    for this POC/ prototype. Eventually, we'll want to integrate all of our writers.`,
  },
];

export default function VerticalLinearStepper() {
  const [activeStep, setActiveStep] = useState(0);
  const [buttonStates, setButtonStates] = useState(
    Array(steps.length).fill(Array(2).fill(false))
  );

  const handleButtonClick = (stepIndex, buttonIndex) => {
    const newButtonStates = [...buttonStates];
    newButtonStates[stepIndex][buttonIndex] =
      !newButtonStates[stepIndex][buttonIndex];
    setButtonStates(newButtonStates);
  };

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  return (
    <ThemeProvider theme={thirdEyesTheme}>
      <Box sx={{ maxWidth: 400 }}>
        <Stepper activeStep={activeStep} orientation="vertical">
          {steps.map((step, stepIndex) => (
            <Step key={step.label}>
              <StepLabel>{step.label}</StepLabel>
              <StepContent>
                <Typography>{step.description}</Typography>
                <Box sx={{ mb: 2 }}>
                  <div className="buttons--parameters">
                    {step.buttons &&
                      step.buttons.map((button, buttonIndex) => (
                        <Button
                          key={buttonIndex}
                          onClick={() =>
                            handleButtonClick(stepIndex, buttonIndex)
                          }
                          sx={{ mt: 1, mr: 1 }}
                          variant={
                            buttonStates[stepIndex][buttonIndex]
                              ? "selected"
                              : "outlined"
                          }
                        >
                          {button.buttonLabel}
                        </Button>
                      ))}
                  </div>
                  <div>
                    <Button
                      variant="contained"
                      onClick={handleNext}
                      sx={{ mt: 1, mr: 1 }}
                    >
                      {activeStep === steps.length - 1 ? "Finish" : "Next"}
                    </Button>
                    <Button
                      disabled={activeStep === 0}
                      onClick={handleBack}
                      sx={{ mt: 1, mr: 1 }}
                    >
                      Back
                    </Button>
                  </div>
                </Box>
              </StepContent>
            </Step>
          ))}
        </Stepper>
      </Box>
    </ThemeProvider>
  );
}
