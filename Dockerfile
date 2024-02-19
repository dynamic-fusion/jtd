# Step 1: Use an official Node.js runtime as a parent image
FROM node:14-alpine as build

# Step 2: Set the working directory in the container
WORKDIR /app

# Step 3: Copy the package.json and package-lock.json (or yarn.lock) files
COPY package*.json ./

# Step 4: Install project dependencies
RUN npm install

# Step 5: Copy the project files into the container
COPY . .

# Step 6: Build the app for production
RUN npm run build

# Step 7: Use Nginx to serve the React app
FROM nginx:alpine

# Step 8: Copy the build output to replace the default nginx contents
COPY --from=build /app/build /usr/share/nginx/html

# Step 9: Expose port 80 to the outside once the container has launched
EXPOSE 80

# Step 10: Define the command to run your app using CMD which defines your runtime
CMD ["nginx", "-g", "daemon off;"]
