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
      { buttonLabel: "Hammett", buttonValue: "hammett" },
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
        <div className="parameters parameters--selection">
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
        </div>
        {activeStep === steps.length && (
          <div className="parameters parameters--selected">
            <Paper square elevation={2} sx={{ p: 3 }}>
              <h4>Config complete. You&apos;ve selected:</h4>
              <ul>
                {buttonStates.map((step, stepIndex) => {
                  const selectedButtons =
                    steps[stepIndex].buttons &&
                    steps[stepIndex].buttons.filter(
                      (_, buttonIndex) => buttonStates[stepIndex][buttonIndex]
                    );

                  return (
                    <li key={stepIndex}>
                      {steps[stepIndex].label.replace("Select ", "")}:{" "}
                      {steps[stepIndex].buttons ? (
                        <>
                          {selectedButtons.map((button, buttonIndex) => (
                            <span key={buttonIndex}>
                              {buttonStates[stepIndex][buttonIndex]}
                              {console.log("buttonIndex", buttonIndex)}
                              {button.buttonLabel}
                              {buttonIndex < selectedButtons.length - 1 && ", "}
                            </span>
                          ))}
                        </>
                      ) : (
                        <span key={stepIndex}>
                          {steps[stepIndex].label === "Select Work Type"
                            ? "Essential Album Review Notes"
                            : "Philip Sherburne"}
                        </span>
                      )}
                    </li>
                  );
                })}
              </ul>
              <div>
                <Button
                  variant="contained"
                  onClick={() => console.log("submit")}
                  sx={{ mt: 1, mr: 1 }}
                >
                  Next
                </Button>
                <Button onClick={handleReset} sx={{ mt: 1, mr: 1 }}>
                  Edit
                </Button>
              </div>
            </Paper>
          </div>
        )}
      </Box>
    </ThemeProvider>
  );
}
