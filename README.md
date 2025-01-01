# unishare?
# jenkins-test

`docker pull def1s/jenkins-test`  
or  
`docker build -t def1s/jenkins-test --build-arg BRANCH=dev .`  
then  
`docker run -dp 3080:80 --name jenkins-test def1s/jenkins-test`
