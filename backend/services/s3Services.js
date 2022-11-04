const AWS=require('aws-sdk')

const uploadToS3=async (fileName,data)=>{
    const bucketName=`expensetrackerdaytodaydata` //${process.env.bucketName}
    try {
        const s3Bucket= await new AWS.S3({
            accessKeyId:`AKIA5HFAWTNLEASI6LYG`, //${process.env.accessKeyId}
            secretAccessKey: `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` //${process.env.secretAccessKey}
            
        })
        const params={
            Bucket:bucketName,
            Key:fileName,
            Body:data,
            ACL:'public-read'
        }

        return new Promise((resolve,reject)=>{
            s3Bucket.upload(params,(err,s3response)=>{
                if(err)
                    reject(err)
                else{
                    console.log(s3response)
                    resolve(s3response.Location)
                }
            })
        })
    } catch (error) {
        console.log(error)
    }
}

module.exports={
    uploadToS3
}