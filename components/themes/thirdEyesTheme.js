import { createTheme } from '@material-ui/core/styles';

export const thirdEyesTheme = createTheme({
  components: {
    MuiButton: {
      variants: [
        {
          props: { variant: 'selected' },
          style: {
            backgroundColor: '#4caf50',
            color: '#fff',
            '&:hover': {
              backgroundColor: '#388e3c',
            },
          },
        },
      ],
    },
  },
});