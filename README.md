# TOPWorkshop - Serverless

![AWS CodeBuild](https://codebuild.eu-west-1.amazonaws.com/badges?uuid=eyJlbmNyeXB0ZWREYXRhIjoic243KzBUbmNpcGZFS3dtOUVna3lqSUV4VjUyRHFsSlJ6OUYyUm1vSTZjb1dHQTByQjdnUlMvT1o4dFlLQ2pycG5FZnRFZ3g2UzIzK1Jla1N5WFJxOENRPSIsIml2UGFyYW1ldGVyU3BlYyI6IlY5eFgxeTdUdjhxajkybTEiLCJtYXRlcmlhbFNldFNlcmlhbCI6MX0%3D&branch=master)

A simple serverless application to show what serverless (the AWS flavour) really is

## Architecture

![Our architecture](docs/TOPWS-Serverless.png)

## TODO List

- [x] Retrieve API endpoint and:
  - [x] Update telegram bot
  - [x] Send via telegram
  - [x] Make lambda endpoint dynamic (for the static part)
- [x] Make VueJS working again
- [x] Remove babel-preset-2015 -> babel-preset-env
- [x] Test log dispatch
- [x] Re-populate config table
- [ ] Add IOpipe
  - [ ] Open issue to serverless-plugin-iopipe
- [x] Add the CodeBuild badge
- [ ] Logs from API Gateway
