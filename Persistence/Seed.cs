using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Domain;
using System.IO;
using System.Xml.Serialization;
using System.Xml;
using System.Reflection;

namespace Persistence
{
    public class Seed
    {
        public static async Task SeedData(DataContext context)
        {
            
            if (context.Jobs.Any()) return;
            
            List<Job> jobs = new List<Job>();

            string dir = "data.xml"; //file xml I created located in folder API

            //Root element xml file
            XmlRootAttribute xRoot = new XmlRootAttribute();
            xRoot.ElementName = "ArrayOfJob"; //root xml file 
            xRoot.IsNullable = true;


            //Data Deserialization
            XmlSerializer deserializer = new XmlSerializer(typeof(GroupOfList) , xRoot);
            TextReader reader = new StreamReader(dir);
            object obj = deserializer.Deserialize(reader);

            
            GroupOfList XmlData = (GroupOfList)obj;
            reader.Close();

         

            
            await context.Jobs.AddRangeAsync(XmlData.JobList);
            await context.SaveChangesAsync();
        }


 
        public static void Serialize(List<Job> list ,string dir)
        {
            XmlSerializer serializer = new XmlSerializer(typeof(List<Job>));
            XmlTextWriter writer = null;
            using ( writer = new XmlTextWriter(dir,System.Text.Encoding.UTF8))
            {
                writer.Formatting = Formatting.Indented;
                writer.Indentation = 2;
                serializer.Serialize(writer , list);
            }
        }

    }
}