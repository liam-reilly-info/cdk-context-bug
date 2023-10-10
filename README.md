This sample project demonstrates a frustrating issue with CDK.

Unless you happen to have a `cdk.context.json` file on your machine when you run a `cdk build` / `cdk diff` / `cdk deploy`
then it will fail if your code relies on there being 3x Subnets as you will receive an array with
only 2 dummy values; `p-12345` and `p-67890`.

To read more about this please refer to the accompanying post: https://www.liam-reilly.info/blog/post/still-sst-ruggling

```typescript
 // ---------------------------- BACKGROUND ---------------------------- //
// If you have no CDK Context file that contains VPC and Subnet Info
// CDK inserts 2x placeholder values into the privateSubnets
// array for a Vpc object obtained via a Vpc.fromLookup()
// This means our code breaks in situations where we expect
// there to be more than 2 items in the array
// to reproduce put your Account, Region and VPC ID in to /bin/cdk-context-bug.ts
// ensure that you have a cleared CDK Context first by deleting the file
// cdk.context.json and run cdk diff
// ---------------------------- BACKGROUND ---------------------------- //


// ID of a VPC that has 3x private subnets
const { vpcId } = props

const vpc = Vpc.fromLookup(this, "vpc-lookup", {
    vpcId: vpcId
})

// With a CDK Context this will print out the Subnet IDs
// for all 3 of my private subnets
// Without a CDK Context this will print out 2x dummy Subnet IDs
// then it will look up the real VPC and print out the 3x REAL Subnet IDs
console.log(`Subnet 1 ID: ${vpc.privateSubnets[0].subnetId}`)
console.log(`Subnet 2 ID: ${vpc.privateSubnets[1].subnetId}`)

// If we include this line then we will get an error because
// the privateSubnets array only contains 2 dummy values,
// and we're trying to reference the third value that would
// only be looked up later

// if (vpc.privateSubnets.length < 3) return // If you uncomment this line everything will work
console.log(`Subnet 3 ID: ${vpc.privateSubnets[2].subnetId}`)

// The actual output will be
// Subnet 1 ID: p-12345 // dummy placeholder
// Subnet 2 ID: p-67890 // dummy placeholder
// Subnet 1 ID: subnet-?????? // first real value
// Subnet 2 ID: subnet-?????? // second real value
// Subnet 3 ID: subnet-?????? // third real value
```